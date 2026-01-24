'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel';
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs';
import { uploadProductImage, deleteProductImage } from '@/lib/features/product/data/sources/ProductStorage';
import { validateImageAspectRatio, compressImage, getImageDimensions } from '@/lib/utils/imageUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';

interface ProductFormProps {
  product?: ProductModel | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EXPECTED_ASPECT_RATIO = 4 / 3; // 4:3 aspect ratio
const MAX_IMAGE_SIZE_MB = 1; // 1MB max after compression
const MAX_IMAGE_DIMENSION = 1920; // Max width or height

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    originalPrice: product?.originalPrice?.toString() || '',
    discountPercent: product?.discountPercent?.toString() || '0',
    outOfStock: product?.outOfStock || false,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.thumbnail || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('Please select a valid image file');
        return;
      }

      // Get dimensions first for display
      const dimensions = await getImageDimensions(file);
      console.log('Image dimensions:', dimensions);

      // Validate aspect ratio
      const isValidAspectRatio = await validateImageAspectRatio(file, EXPECTED_ASPECT_RATIO);
      if (!isValidAspectRatio) {
        setImageError(
          `Image must have a 4:3 aspect ratio. Current ratio is approximately ${(dimensions.width / dimensions.height).toFixed(2)}:1. Please use an image with dimensions like 1600x1200, 800x600, or similar 4:3 sizes.`
        );
        return;
      }

      // Set selected image
      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error validating image:', error);
      setImageError('Failed to validate image. Please try another file.');
    }
  };

  const calculatePrice = (originalPrice: number, discountPercent: number): number => {
    return originalPrice * (1 - discountPercent / 100);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      const originalPrice = parseFloat(formData.originalPrice);
      const discountPercent = parseInt(formData.discountPercent);

      if (!formData.name.trim()) {
        throw new Error('Product name is required');
      }

      if (isNaN(originalPrice) || originalPrice <= 0) {
        throw new Error('Please enter a valid original price');
      }

      if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
        throw new Error('Discount percent must be between 0 and 100');
      }

      if (!product && !selectedImage) {
        throw new Error('Please select a product image');
      }

      // Calculate final price
      const price = calculatePrice(originalPrice, discountPercent);

      let thumbnailUrl = product?.thumbnail || '';

      // Upload image if a new one was selected
      if (selectedImage) {
        console.log('Compressing image...');
        const compressedImage = await compressImage(
          selectedImage,
          MAX_IMAGE_SIZE_MB,
          MAX_IMAGE_DIMENSION
        );
        console.log('Image compressed:', {
          original: selectedImage.size,
          compressed: compressedImage.size,
        });

        // Generate a temporary ID for new products
        const productId = product?.id || `temp_${Date.now()}`;

        console.log('Uploading image...');
        thumbnailUrl = await uploadProductImage(compressedImage, productId);
        console.log('Image uploaded:', thumbnailUrl);

        // Delete old image if editing and new image uploaded
        if (product?.thumbnail && product.thumbnail !== thumbnailUrl) {
          await deleteProductImage(product.thumbnail);
        }
      }

      // Prepare product data
      const productData: Omit<ProductModel, 'id'> = {
        name: formData.name.trim(),
        originalPrice,
        price,
        discountPercent,
        outOfStock: formData.outOfStock,
        thumbnail: thumbnailUrl,
        previews: [thumbnailUrl], // Use thumbnail as first preview
      };

      // Save to Firestore
      if (product) {
        // Update existing product
        await FirestoreProductsDs.updateProduct(product.id, productData);
      } else {
        // Create new product
        await FirestoreProductsDs.addProduct(productData);
      }

      // Success
      onSuccess();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g., 7cm Electric Sparklers"
          required
        />
      </div>

      {/* Original Price */}
      <div>
        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
          Original Price ($) <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          id="originalPrice"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleInputChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>

      {/* Discount Percent */}
      <div>
        <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700 mb-2">
          Discount Percent (0-100) <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          id="discountPercent"
          name="discountPercent"
          value={formData.discountPercent}
          onChange={handleInputChange}
          placeholder="0"
          min="0"
          max="100"
          required
        />
        {formData.originalPrice && formData.discountPercent && (
          <p className="mt-2 text-sm text-gray-600">
            Final Price: $
            {calculatePrice(
              parseFloat(formData.originalPrice),
              parseInt(formData.discountPercent)
            ).toFixed(2)}
          </p>
        )}
      </div>

      {/* Out of Stock */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="outOfStock"
          name="outOfStock"
          checked={formData.outOfStock}
          onChange={handleInputChange}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="outOfStock" className="text-sm font-medium text-gray-700">
          Out of Stock
        </label>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image (4:3 aspect ratio) {!product && <span className="text-red-500">*</span>}
        </label>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Product preview"
              className="w-full max-w-md h-auto rounded-lg border border-gray-300"
            />
          </div>
        )}

        {/* Image Error */}
        {imageError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{imageError}</span>
          </div>
        )}

        {/* Upload Button */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {imagePreview ? 'Change Image' : 'Upload Image'}
        </Button>
        <p className="mt-2 text-xs text-gray-500">
          Recommended: 1600x1200px or any 4:3 ratio. Image will be compressed automatically.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !!imageError} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {product ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{product ? 'Update Product' : 'Create Product'}</>
          )}
        </Button>
      </div>
    </form>
  );
}
