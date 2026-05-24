'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getAuth } from 'firebase/auth'
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel'
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs'
import { deleteProductImage, uploadProductImage, uploadProductPreview } from '@/lib/features/product/data/sources/ProductStorage'
import { ProductForm } from '@/components/inventory/ProductForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit, Plus, Package, AlertCircle, Upload, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MediaCarousel } from '@/components/ui/MediaCarousel'

interface InventoryItem {
    product: ProductModel;
    isNew: boolean;
    isDeleted: boolean;
    isDirty: boolean;
    fileChanges?: {
        thumbnail: File | null;
        newPreviews: { name: string, file: File }[];
        deletedPreviews: string[];
    };
}

export default function InventoryPage() {
    const { user, loading, isAdmin } = useAuth()
    const router = useRouter()

    // Staged State
    const [items, setItems] = useState<InventoryItem[]>([])
    const [originalItems, setOriginalItems] = useState<ProductModel[]>([]) // To detect clean state if needed, but 'isDirty' flag likely sufficient
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())

    const [loadingProducts, setLoadingProducts] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)
    const [isImporting, setIsImporting] = useState(false)
    const [importProgress, setImportProgress] = useState(0)
    const [importStatus, setImportStatus] = useState('')

    // Saving State
    const [isSaving, setIsSaving] = useState(false)
    const [saveProgress, setSaveProgress] = useState(0)
    const [saveStatus, setSaveStatus] = useState('')

    // Media Carousel State
    const [showCarousel, setShowCarousel] = useState(false)
    const [carouselProduct, setCarouselProduct] = useState<ProductModel | null>(null)

    // Function to open MediaCarousel
    const openMediaCarousel = (product: ProductModel) => {
        setCarouselProduct(product)
        setShowCarousel(true)
    }

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/')
        }
    }, [user, isAdmin, loading, router])

    useEffect(() => {
        if (isAdmin) {
            loadProducts()
        }
    }, [isAdmin])

    const hasUnsavedChanges = items.some(i => i.isDirty || i.isDeleted || i.isNew);

    // Unsaved Changes Protection
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges && !isSaving) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, isSaving]);

    const loadProducts = async () => {
        try {
            setLoadingProducts(true)
            console.log('Loading products from Firestore...');
            const fetchedProducts = await FirestoreProductsDs.getProducts()
            console.log('Loaded products from Firestore:', fetchedProducts.length);
            console.log('Sample product data:', fetchedProducts.slice(0, 2).map(p => ({
                id: p.id,
                name: p.name,
                thumbnail: p.thumbnail,
                previewCount: p.previews?.length || 0,
                previews: p.previews
            })));
            setOriginalItems(fetchedProducts)
            setItems(fetchedProducts.map(p => ({
                product: p,
                isNew: false,
                isDeleted: false,
                isDirty: false
            })))
            setDeletedIds(new Set())
            console.log('Products loaded and set in state');
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoadingProducts(false)
        }
    }

    const handleImportProducts = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            
            setIsImporting(true);
            setImportProgress(0);
            setImportStatus('Reading file...');
            
            try {
                const text = await file.text();
                const products = JSON.parse(text);
                
                if (!Array.isArray(products)) {
                    throw new Error('Invalid JSON format. Expected array of products.');
                }
                
                setImportStatus('Processing products...');
                setImportProgress(20);
                
                const newItems: InventoryItem[] = [];
                let processedCount = 0;
                const totalProducts = products.length;
                
                for (const product of products) {
                    processedCount++;
                    const progress = 20 + (processedCount / totalProducts) * 70;
                    setImportProgress(Math.round(progress));
                    setImportStatus(`Processing ${product.name || 'Product'} (${processedCount}/${totalProducts})`);
                    
                    // Validate required fields
                    if (!product.name || !product.price || !product.category) {
                        console.warn(`Skipping invalid product:`, product);
                        continue;
                    }
                    
                    // Generate unique ID
                    const tempId = `import_${Date.now()}_${processedCount}`;
                    
                    // Create inventory item
                    const inventoryItem: InventoryItem = {
                        product: {
                            id: tempId,
                            name: product.name,
                            content: product.content || '',
                            price: parseFloat(product.price) || 0,
                            originalPrice: parseFloat(product.originalPrice) || parseFloat(product.price) || 0,
                            discountPercent: product.originalPrice ? 
                                Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100) : 0,
                            category: product.category || 'uncategorized',
                            categoryPosition: parseInt(product.categoryPosition) || 0,
                            productPosition: parseInt(product.productPosition) || 0,
                            outOfStock: product.outOfStock || false,
                            previews: product.previews || [],
                            // SEO Fields
                            seoTitle: product.seoTitle,
                            seoDescription: product.seoDescription,
                            seoKeywords: product.seoKeywords,
                            metaTitle: product.metaTitle,
                            metaDescription: product.metaDescription,
                            canonicalUrl: product.canonicalUrl,
                            structuredData: product.structuredData,
                            // YouTube Video Fields
                            youtubeVideoId: product.youtubeVideoId,
                            videoThumbnail: product.videoThumbnail,
                            videoTitle: product.videoTitle,
                            videoDescription: product.videoDescription
                        },
                        isNew: true,
                        isDeleted: false,
                        isDirty: true
                    };
                    
                    // Only add thumbnail if it exists
                    if (product.thumbnail) {
                        inventoryItem.product.thumbnail = product.thumbnail;
                    }
                    
                    newItems.push(inventoryItem);
                }
                
                setImportProgress(95);
                setImportStatus('Adding products to inventory...');
                
                // Add new items to existing items
                setItems(prev => [...prev, ...newItems]);
                
                setImportProgress(100);
                setImportStatus(`Successfully imported ${newItems.length} products!`);
                
                setTimeout(() => {
                    setIsImporting(false);
                    setImportProgress(0);
                    setImportStatus('');
                }, 2000);
                
            } catch (error) {
                console.error('Import error:', error);
                setImportStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setTimeout(() => {
                    setIsImporting(false);
                    setImportProgress(0);
                    setImportStatus('');
                }, 3000);
            }
        };
        
        input.click();
    }

    const handleAddProduct = () => {
        setEditingItemIndex(-1) // -1 for new
        setIsFormOpen(true)
    }

    const handleEditProduct = (index: number) => {
        setEditingItemIndex(index)
        setIsFormOpen(true)
    }

    const handleDeleteToggle = (index: number) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], isDeleted: !newItems[index].isDeleted };
            return newItems;
        });
    }

    const handleFormSuccess = (
        productData: Omit<ProductModel, 'id'>,
        thumbnailFile: File | null,
        previewFiles: { name: string, file: File }[],
        deletedPreviews: string[]
    ) => {
        setItems(prev => {
            const newItems = [...prev];
            let itemCategory = productData.category;
            let newCategoryPosition = productData.categoryPosition;
            let didCategoryPositionChange = false;

            if (editingItemIndex === -1) {
                // Add New
                const tempId = `new_${Date.now()}`;
                newItems.push({
                    product: { ...productData, id: tempId },
                    isNew: true,
                    isDeleted: false,
                    isDirty: true,
                    fileChanges: {
                        thumbnail: thumbnailFile,
                        newPreviews: previewFiles,
                        deletedPreviews: deletedPreviews
                    }
                });
                // Note: Even for a new item, if they set a categoryPosition, we should probably sync it to others in the category for consistency
                didCategoryPositionChange = true;
            } else if (editingItemIndex !== null) {
                // Edit Existing
                const existing = newItems[editingItemIndex!];
                didCategoryPositionChange = existing.product.categoryPosition !== newCategoryPosition;

                newItems[editingItemIndex!] = {
                    ...existing,
                    product: { ...productData, id: existing.product.id },
                    isDirty: true,
                    fileChanges: {
                        thumbnail: thumbnailFile || (existing.fileChanges?.thumbnail || null),
                        newPreviews: [...(existing.fileChanges?.newPreviews || []), ...previewFiles],
                        deletedPreviews: [...(existing.fileChanges?.deletedPreviews || []), ...deletedPreviews]
                    }
                };
            }

            // Sync categoryPosition to all other items in the same category (if changed and category is set)
            if (didCategoryPositionChange && itemCategory.trim() !== '') {
                for (let i = 0; i < newItems.length; i++) {
                    if (i !== editingItemIndex && newItems[i].product.category === itemCategory) {
                        newItems[i] = {
                            ...newItems[i],
                            product: { ...newItems[i].product, categoryPosition: newCategoryPosition },
                            isDirty: true // Mark as dirty so it gets saved
                        };
                    }
                }
            }

            return newItems;
        });
        setIsFormOpen(false)
        setEditingItemIndex(null)
    }

    const saveChanges = async () => {
        if (!confirm('Are you sure you want to save all changes? This action cannot be undone.')) return;

        setIsSaving(true);
        setSaveProgress(0);
        setSaveStatus('Preparing...');

        try {
            console.log('Starting save process...');
            console.log('Total items:', items.length);
            
            // Filter changes
            const itemsToProcess = items.filter(i => i.isDirty || i.isDeleted || i.isNew);
            console.log('Items to process:', itemsToProcess.length);
            
            const totalSteps = itemsToProcess.length * 2; // rough estimate
            let completedSteps = 0;

            const updateProgress = (status: string) => {
                completedSteps++;
                setSaveProgress(Math.min(100, Math.round((completedSteps / totalSteps) * 100)));
                setSaveStatus(status);
                console.log('Progress:', status, `${completedSteps}/${totalSteps}`);
            };

            // Check authentication
            const auth = getAuth();
            const currentUser = auth.currentUser;
            console.log('Current user authenticated:', !!currentUser);
            if (!currentUser) {
                throw new Error('User not authenticated. Please login to save changes.');
            }

            // Process Deletions First
            const deletedItems = items.filter(i => i.isDeleted && !i.isNew);
            console.log('Items to delete:', deletedItems.length);
            updateProgress(`Deleting ${deletedItems.length} items...`);

            for (const item of deletedItems) {
                console.log('Deleting item:', item.product.name);
                try {
                    // Delete images
                    if (item.product.thumbnail) {
                        console.log('Deleting thumbnail:', item.product.thumbnail);
                        await deleteProductImage(item.product.thumbnail);
                    }
                    for (const preview of item.product.previews) {
                        console.log('Deleting preview:', preview);
                        await deleteProductImage(preview);
                    }
                    // Delete doc
                    console.log('Deleting Firestore document:', item.product.id);
                    await FirestoreProductsDs.deleteProduct(item.product.id);
                    console.log('Successfully deleted item:', item.product.name);
                } catch (error) {
                    console.error('Error deleting item:', item.product.name, error);
                    throw new Error(`Failed to delete item ${item.product.name}: ${(error as Error).message}`);
                }
            }

            // Process Updates / Creates
            const activeItems = items.filter(i => !i.isDeleted && (i.isDirty || i.isNew));
            console.log('Items to save/update:', activeItems.length);

            for (const item of activeItems) {
                console.log('Processing item:', item.product.name, {
                    isNew: item.isNew,
                    isDirty: item.isDirty,
                    hasThumbnail: !!item.fileChanges?.thumbnail,
                    hasPreviews: item.fileChanges?.newPreviews?.length || 0
                });
                updateProgress(`Saving ${item.product.name}...`);

                let productData = { ...item.product };
                const fileChanges = item.fileChanges;

                try {
                    // 1. Delete removed previews
                    if (fileChanges?.deletedPreviews) {
                        console.log('Deleting removed previews:', fileChanges.deletedPreviews.length);
                        for (const url of fileChanges.deletedPreviews) {
                            console.log('Deleting preview URL:', url);
                            await deleteProductImage(url);
                        }
                    }

                    // 2. Upload Thumbnail
                    if (fileChanges?.thumbnail) {
                        console.log('Uploading thumbnail for:', productData.name);
                        const url = await uploadProductImage(fileChanges.thumbnail, productData.name);
                        console.log('Thumbnail uploaded successfully:', url);
                        productData.thumbnail = url;
                    }

                    // 3. Upload Previews
                    if (fileChanges?.newPreviews) {
                        console.log('Uploading previews:', fileChanges.newPreviews.length);
                        const uploadedPreviewUrls = [];
                        for (const p of fileChanges.newPreviews) {
                            console.log('Uploading preview:', p.name);
                            const url = await uploadProductPreview(p.file, productData.name, p.name);
                            console.log('Preview uploaded successfully:', url);
                            uploadedPreviewUrls.push(url);
                        }
                        productData.previews = [...productData.previews, ...uploadedPreviewUrls];
                    }

                    // 4. Save to Firestore
                    console.log('Saving to Firestore:', {
                        isNew: item.isNew,
                        productId: item.product.id,
                        hasThumbnail: !!productData.thumbnail,
                        thumbnailUrl: productData.thumbnail,
                        previewCount: productData.previews.length,
                        previews: productData.previews,
                        fullProductData: productData
                    });

                    if (item.isNew) {
                        const { id, ...data } = productData;
                        console.log('Adding new product with data:', {
                            name: data.name,
                            thumbnail: data.thumbnail,
                            previews: data.previews
                        });
                        const docId = await FirestoreProductsDs.addProduct(data);
                        console.log('Successfully added new product:', docId, data.name);
                    } else {
                        const { id, ...data } = productData;
                        console.log('Updating product with data:', {
                            id: id,
                            name: data.name,
                            thumbnail: data.thumbnail,
                            previews: data.previews
                        });
                        await FirestoreProductsDs.updateProduct(id, data);
                        console.log('Successfully updated product:', id, data.name);
                    }

                } catch (error) {
                    console.error('Error processing item:', item.product.name, error);
                    throw new Error(`Failed to save item ${item.product.name}: ${(error as Error).message}`);
                }
            }

            setSaveStatus('Complete!');
            setSaveProgress(100);
            console.log('Save process completed successfully!');

            // Ensure modal closes after completion
            setTimeout(() => {
                console.log('Closing save modal...');
                setIsSaving(false);
                
                // Force reload products to show updated thumbnails
                console.log('Reloading products to show updated thumbnails...');
                loadProducts().then(() => {
                    console.log('Products reloaded successfully');
                    // Force a re-render by updating the items state
                    window.location.reload(); // Force page refresh to ensure new images appear
                }).catch(error => {
                    console.error('Error reloading products:', error);
                });
            }, 1000);

        } catch (error) {
            console.error('Error saving changes:', error);
            console.error('Error details:', {
                name: (error as Error).name,
                message: (error as Error).message,
                stack: (error as Error).stack
            });
            
            // Provide more specific error messages
            let errorMessage = 'Failed to save changes';
            if ((error as Error).message.includes('permission-denied') || (error as Error).message.includes('unauthorized')) {
                errorMessage = 'Permission denied. You must be logged in as an admin to save changes.';
            } else if ((error as Error).message.includes('network')) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if ((error as Error).message.includes('Failed to upload')) {
                errorMessage = 'Image upload failed. Please check the images and try again.';
            } else {
                errorMessage = `Error: ${(error as Error).message}`;
            }
            
            setSaveStatus(errorMessage);
            console.error(error);
            alert('Error saving changes. Check console for details.');
            setIsSaving(false);
        }
    }


    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 md:py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-3xl font-bold text-slate-900 mb-4">Inventory Management</h1>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        {hasUnsavedChanges && (
                            <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-2 rounded text-sm font-medium">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Unsaved Changes
                            </div>
                        )}
                        <Button onClick={handleAddProduct} className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                        <Button onClick={handleImportProducts} variant="outline" disabled={isImporting} className="w-full sm:w-auto">
                            <Upload className="h-4 w-4 mr-2" />
                            {isImporting ? 'Importing...' : 'Import JSON'}
                        </Button>
                        <Button
                            onClick={saveChanges}
                            disabled={!hasUnsavedChanges || isSaving || isImporting}
                            className={`
                                ${hasUnsavedChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'} 
                                text-white w-full sm:w-auto sm:min-w-[140px]
                            `}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {loadingProducts ? (
                    <Card className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </Card>
                ) : items.filter(i => !i.isDeleted).length === 0 && items.filter(i => i.isDeleted).length === 0 ? (
                    <Card className="p-12 text-center">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-4">No products yet</p>
                        <Button onClick={handleAddProduct} className="bg-primary text-white hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Card>
                ) : (
                    <div className="pb-20">
                        {/* Group items by Category */}
                        {(() => {
                            const activeItems = items.filter(i => !i.isDeleted);
                            // Get unique categories, mapping empty/whitespace to 'Unlisted'
                            const getCatName = (cat: string) => cat?.trim() ? cat.trim() : 'Unlisted';

                            const categories = Array.from(new Set(activeItems.map(i => getCatName(i.product.category))));

                            // Sort categories? Might just rely on how they appeared in the list, or we could sort them if needed. 
                            // Since products are sorted by categoryPosition from DB out-of-the-box, the order of occurrence is likely correct.
                            // However, let's explicitly push 'Unlisted' to the bottom.
                            const sortedCategories = categories.filter(c => c !== 'Unlisted');
                            if (categories.includes('Unlisted')) {
                                sortedCategories.push('Unlisted');
                            }

                            return sortedCategories.map(categoryName => {
                                // Find all items belonging to this category
                                const categoryItemsWithGlobalIndex = items
                                    .map((item, originalIndex) => ({ item, originalIndex }))
                                    .filter(({ item }) => !item.isDeleted && getCatName(item.product.category) === categoryName)
                                    // Sort within category by productPosition to be safe (they are already sorted from DB, but user might have added/edited)
                                    .sort((a, b) => a.item.product.productPosition - b.item.product.productPosition);

                                if (categoryItemsWithGlobalIndex.length === 0) return null;

                                return (
                                    <section key={categoryName} className="mb-8 relative">
                                        {/* Sticky Category Header */}
                                        <div className="sticky top-0 z-10 bg-primary/10 backdrop-blur-md rounded-lg shadow-sm py-3 mb-4 border border-primary/20">
                                            <div className="flex justify-between items-center px-4">
                                                <h2 className="text-xl font-bold capitalize tracking-wide text-primary-foreground">{categoryName.toLowerCase()}</h2>
                                                <Badge className="bg-primary/20 hover:bg-primary/30 text-primary-foreground border-0 shadow-sm">
                                                    {categoryItemsWithGlobalIndex.length} items
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Products Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {categoryItemsWithGlobalIndex.map(({ item, originalIndex }, localIndex) => {
                                                const product = item.product;
                                                const isDirty = item.isDirty || item.isNew;

                                                const handleReorder = (direction: 'up' | 'down') => {
                                                    const swapIndex = direction === 'up' ? localIndex - 1 : localIndex + 1;
                                                    if (swapIndex < 0 || swapIndex >= categoryItemsWithGlobalIndex.length) return; // Cannot move outside bounds

                                                    const targetItemWithGlobalIndex = categoryItemsWithGlobalIndex[swapIndex];

                                                    setItems(prevItems => {
                                                        const newItems = [...prevItems];
                                                        // Swap productPosition values
                                                        const currentPos = newItems[originalIndex].product.productPosition;
                                                        const targetPos = newItems[targetItemWithGlobalIndex.originalIndex].product.productPosition;

                                                        // If they happen to have the same position number, force a difference
                                                        if (currentPos === targetPos) {
                                                            newItems[originalIndex].product.productPosition = direction === 'up' ? currentPos - 1 : currentPos + 1;
                                                        } else {
                                                            newItems[originalIndex].product.productPosition = targetPos;
                                                            newItems[targetItemWithGlobalIndex.originalIndex].product.productPosition = currentPos;
                                                        }

                                                        newItems[originalIndex].isDirty = true;
                                                        newItems[targetItemWithGlobalIndex.originalIndex].isDirty = true;

                                                        return newItems;
                                                    });
                                                };

                                                return (
                                                    <Card
                                                        key={product.id}
                                                        className={`group relative flex flex-row md:flex-col bg-white overflow-hidden hover:shadow-lg transition-shadow border-2 ${isDirty ? 'border-amber-400' : 'border-transparent'}`}
                                                    >
                                                        {/* Image Section */}
                                                        <div
                                                            className="relative w-[100px] h-[100px] md:w-full md:h-48 shrink-0 bg-gray-100 flex items-center justify-center cursor-pointer"
                                                            onClick={() => openMediaCarousel(product)}
                                                        >
                                                            {item.fileChanges?.thumbnail ? (
                                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 bg-gray-200">New Img</div>
                                                            ) : product.thumbnail ? (
                                                                <img 
                                                                    src={product.thumbnail} 
                                                                    alt={product.name} 
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        const img = e.target as HTMLImageElement;
                                                                        if (product.thumbnail && product.thumbnail.includes('firebasestorage.googleapis.com')) {
                                                                            const fixedUrl = product.thumbnail.includes('?') 
                                                                                ? `${product.thumbnail}&alt=media`
                                                                                : `${product.thumbnail}?alt=media`;
                                                                            img.src = fixedUrl;
                                                                        }
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Package className="h-8 w-8 text-gray-400" />
                                                            )}

                                                            <div className="md:hidden absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                                                                {product.outOfStock ? (
                                                                    <Badge className="bg-red-100 text-red-800 border-red-200 text-[10px] px-1.5 h-4 shadow-sm">Out of Stock</Badge>
                                                                ) : (
                                                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] px-1.5 h-4 shadow-sm">In Stock</Badge>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Content Section */}
                                                        <div className="flex-1 p-3 md:p-4 flex flex-col relative min-w-0">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="font-semibold text-slate-900 text-sm md:text-lg line-clamp-2 leading-tight md:leading-snug mb-1">
                                                                        {product.name}
                                                                    </h3>
                                                                    {(item.isNew || isDirty) && (
                                                                        <div className="flex flex-wrap gap-1 mb-1">
                                                                            {item.isNew && <Badge className="bg-blue-100 text-blue-800 text-[10px] px-1.5 h-4">New</Badge>}
                                                                            {isDirty && !item.isNew && <Badge className="bg-amber-100 text-amber-800 text-[10px] px-1.5 h-4">Modified</Badge>}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 -mt-2 -mr-2 text-gray-500 hover:text-primary" onClick={() => handleEditProduct(originalIndex)}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            <div className="mt-1 md:mt-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs md:text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
                                                                    <span className="text-sm md:text-lg font-bold text-green-600">₹{product.price.toFixed(2)}</span>
                                                                    <span className="text-[10px] md:text-xs text-green-700 bg-green-50 px-1 rounded ml-1">{product.discountPercent}% OFF</span>
                                                                </div>
                                                            </div>

                                                            {/* Desktop Actions including ordering arrows */}
                                                            <div className="hidden md:flex flex-col gap-3 mt-4 flex-1 justify-end">
                                                                <div className="flex justify-between items-center">
                                                                    {product.outOfStock ? (
                                                                        <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>
                                                                    ) : (
                                                                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Stock</Badge>
                                                                    )}
                                                                </div>

                                                                <div className="flex gap-2">
                                                                    <div className="flex flex-col bg-gray-50 rounded border justify-between">
                                                                        <button
                                                                            onClick={() => handleReorder('up')}
                                                                            disabled={localIndex === 0}
                                                                            className="px-2 py-0.5 text-gray-500 hover:bg-gray-200 disabled:opacity-30 rounded-t h-1/2 text-xs flex items-center justify-center">
                                                                            ▲
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleReorder('down')}
                                                                            disabled={localIndex === categoryItemsWithGlobalIndex.length - 1}
                                                                            className="px-2 py-0.5 text-gray-500 hover:bg-gray-200 disabled:opacity-30 rounded-b h-1/2 text-xs flex items-center justify-center border-t">
                                                                            ▼
                                                                        </button>
                                                                    </div>

                                                                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(originalIndex)} className="flex-1">
                                                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                                                    </Button>
                                                                    <Button variant="outline" size="icon" onClick={() => handleDeleteToggle(originalIndex)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shrink-0">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            <Button variant="ghost" size="icon" className="md:hidden absolute bottom-1 right-1 h-8 w-8 text-red-400 hover:text-red-600" onClick={() => handleDeleteToggle(originalIndex)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </section>
                                );
                            });
                        })()}

                        {/* Deleted Items Section */}
                        {items.some(i => i.isDeleted) && (
                            <div className="col-span-full mt-8 border-t pt-8">
                                <h3 className="text-gray-500 font-semibold mb-4">Pending Deletion</h3>
                                <div className="space-y-2 opacity-60">
                                    {items.map((item, index) => {
                                        if (!item.isDeleted) return null;
                                        return (
                                            <div key={item.product.id} className="flex justify-between items-center bg-red-50 p-3 rounded">
                                                <span>{item.product.name}</span>
                                                <Button size="sm" variant="ghost" onClick={() => handleDeleteToggle(index)}>Undo</Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Edit Dialog */}
                <Dialog open={isFormOpen} onOpenChange={(open) => {
                    if (!open) {
                        setIsFormOpen(false);
                        setEditingItemIndex(null);
                    }
                }}>
                    <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl">
                                {editingItemIndex === -1 ? 'Add New Product' : 'Edit Product'}
                            </DialogTitle>
                        </DialogHeader>
                        <ProductForm
                            product={editingItemIndex !== null && editingItemIndex !== -1 ? items[editingItemIndex].product : null}
                            onSuccess={handleFormSuccess}
                            onCancel={() => {
                                setIsFormOpen(false)
                                setEditingItemIndex(null)
                            }}
                        />
                    </DialogContent>
                </Dialog>

                {/* Import Progress Overlay */}
                {isImporting && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl">
                            <h3 className="text-xl font-bold mb-4 text-center">Importing Products</h3>
                            <div className="mb-2 flex justify-between text-sm text-gray-600">
                                <span>{importStatus}</span>
                                <span>{importProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${importProgress}%` }}></div>
                            </div>
                            {importProgress < 100 && (
                                <p className="text-xs text-center text-gray-400">Please do not close this tab.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Save Progress Overlay */}
                {isSaving && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl">
                            <h3 className="text-xl font-bold mb-4 text-center">Saving Changes</h3>
                            <div className="mb-2 flex justify-between text-sm text-gray-600">
                                <span>{saveStatus}</span>
                                <span>{saveProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${saveProgress}%` }}></div>
                            </div>
                            {saveProgress < 100 && (
                                <p className="text-xs text-center text-gray-400">Please do not close this tab.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Media Carousel */}
                {carouselProduct && (
                    <MediaCarousel
                        isOpen={showCarousel}
                        onClose={() => setShowCarousel(false)}
                        images={carouselProduct.previews}
                        videoId={carouselProduct.youtubeVideoId}
                        videoTitle={carouselProduct.videoTitle}
                        productName={carouselProduct.name}
                    />
                )}
            </div>
        </div>
    )
}
