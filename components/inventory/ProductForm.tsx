'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel';
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs';
import { uploadProductImage, deleteProductImage } from '@/lib/features/product/data/sources/ProductStorage';
import { validateImageAspectRatio, compressImage, getImageDimensions } from '@/lib/utils/imageUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, AlertCircle, Loader2, Trash2, Plus } from 'lucide-react';

export interface ProductFormProps {
  product?: ProductModel | null;
  onSuccess: (
    productData: Omit<ProductModel, 'id'>,
    thumbnailFile: File | null,
    previewFiles: { name: string, file: File }[],
    deletedPreviews: string[]
  ) => void;
  onCancel: () => void;
}

const EXPECTED_ASPECT_RATIO = 4 / 3;
const MAX_IMAGE_DIMENSION = 1920;

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price?.toString() || '',
    originalPrice: product?.originalPrice?.toString() || '',
    discountPercent: product?.discountPercent?.toString() || '0',
    outOfStock: product?.outOfStock || false,
    category: product?.category || '',
    categoryPosition: product?.categoryPosition?.toString() || '0',
    productPosition: product?.productPosition?.toString() || '0',
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(product?.thumbnail || null);

  // Manage previews: mix of existing URLs and new Files
  interface PreviewItem {
    id: string; // url for existing, tempId for new
    type: 'url' | 'file';
    url: string; // actual url or objectUrl
    file?: File;
    isImage: boolean;
  }

  const [previews, setPreviews] = useState<PreviewItem[]>(() => {
    return (product?.previews || []).map(url => ({
      id: url,
      type: 'url',
      url: url,
      isImage: !url.toLowerCase().includes('.mp4') && !url.toLowerCase().includes('.webm'), // Simple check, ideally metadata
    }));
  });

  const [deletedPreviews, setDeletedPreviews] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleThumbnailSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setThumbnailFile(file);
    setThumbnailPreview(objectUrl);
  };

  const handlePreviewsSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews: PreviewItem[] = files.map(file => ({
      id: `temp_${Date.now()}_${Math.random()}`,
      type: 'file',
      url: URL.createObjectURL(file), // Local preview
      file: file,
      isImage: file.type.startsWith('image/')
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    const item = previews[index];
    if (item.type === 'url') {
      setDeletedPreviews(prev => [...prev, item.url]);
    }
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const calculatePrice = (originalPrice: number, discountPercent: number): number => {
    return originalPrice * (1 - discountPercent / 100);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const originalPrice = parseFloat(formData.originalPrice);
      const discountPercent = parseInt(formData.discountPercent);

      if (!formData.name.trim()) throw new Error('Product name is required');
      if (isNaN(originalPrice) || originalPrice <= 0) throw new Error('Valid original price is required');

      // Calculate final price automatically if not manually overridden (logic can be adjusted)
      // Here we stick to user input for Original + Discount
      const price = calculatePrice(originalPrice, discountPercent);

      // Construct payload
      // Note: thumbnail string in ProductModel will be updated by parent after upload
      // We pass the current structure. If it's a new file, the parent will process it.
      // If it's an existing URL, we keep it. Use placeholder for new file if needed, or parent handles it.
      // We'll pass the *current state* logic.

      // Pass the list of preview files to upload
      const newPreviewFiles = previews
        .filter(p => p.type === 'file' && p.file)
        .map(p => ({ name: p.file!.name, file: p.file! }));

      // The 'previews' array in the model should contain ONLY the existing URLs that weren't deleted.
      // New URLs will be added by the parent after upload.
      const existingPreviewUrls = previews
        .filter(p => p.type === 'url')
        .map(p => p.url);

      const productData: Omit<ProductModel, 'id'> = {
        name: formData.name.trim(),
        originalPrice,
        price,
        discountPercent,
        outOfStock: formData.outOfStock,
        thumbnail: thumbnailFile ? '' : (thumbnailPreview || ''), // If new file, empty string placeholder
        previews: existingPreviewUrls,
        category: formData.category.trim(),
        categoryPosition: parseInt(formData.categoryPosition) || 0,
        productPosition: parseInt(formData.productPosition) || 0,
      };

      onSuccess(productData, thumbnailFile, newPreviewFiles, deletedPreviews);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded text-sm mb-4">
          <AlertCircle className="inline w-4 h-4 mr-2" /> {error}
        </div>
      )}

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Name *</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g. 1000 Wala"
          required
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Original Price (₹) *</label>
          <Input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <Input
            type="number"
            name="discountPercent"
            value={formData.discountPercent}
            onChange={handleInputChange}
            min="0"
            max="100"
          />
        </div>
      </div>

      {/* Categorization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="e.g. Fireworks"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category Position</label>
          <Input
            type="number"
            name="categoryPosition"
            value={formData.categoryPosition}
            onChange={handleInputChange}
            min="0"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Product Position</label>
          <Input
            type="number"
            name="productPosition"
            value={formData.productPosition}
            onChange={handleInputChange}
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded text-sm flex justify-between">
        <span>Final Price:</span>
        <span className="font-bold text-green-600">
          ₹{calculatePrice(parseFloat(formData.originalPrice) || 0, parseFloat(formData.discountPercent) || 0).toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="outOfStock"
          name="outOfStock"
          checked={formData.outOfStock}
          onChange={handleInputChange}
          className="h-4 w-4"
        />
        <label htmlFor="outOfStock" className="text-sm font-medium">Out of Stock</label>
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium mb-2">Thumbnail (Optional)</label>
        <div className="flex items-start gap-4">
          {thumbnailPreview ? (
            <div className="relative">
              <img src={thumbnailPreview} alt="Thumbnail" className="w-24 h-24 object-cover rounded border" />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => {
                  setThumbnailFile(null);
                  setThumbnailPreview(null);
                }}
              >
                &times;
              </Button>
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-100 rounded border flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
            />
            <p className="text-xs text-gray-500 mt-1">Upload a new image to replace.</p>
          </div>
        </div>
      </div>

      {/* Previews (Images & Videos) */}
      <div>
        <label className="block text-sm font-medium mb-2">Previews (Images & Videos - Optional)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
          {previews.map((preview, index) => (
            <div key={preview.id} className="relative group border rounded overflow-hidden bg-black aspect-[4/3]">
              {preview.isImage ? (
                <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={preview.url} controls className="w-full h-full object-contain" />
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePreview(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              {preview.type === 'file' && (
                <Badge className="absolute bottom-1 left-1 bg-blue-500 text-[10px] px-1 h-4">New</Badge>
              )}
            </div>
          ))}
        </div>

        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handlePreviewsSelect}
            className="hidden"
            id="preview-upload"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('preview-upload')?.click()}>
            <Plus className="h-4 w-4 mr-2" /> Add Previews
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel (Discard Form)
        </Button>
        <Button type="submit" className="flex-1">
          {product ? 'Update Stock' : 'Add to Stock'}
        </Button>
      </div>
      <p className="text-xs text-gray-500 text-center">Changes are staged. Click "Save All Changes" on the main page to persist.</p>
    </form>
  );
}
