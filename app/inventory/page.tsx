'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel'
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs'
import { deleteProductImage, uploadProductImage, uploadProductPreview } from '@/lib/features/product/data/sources/ProductStorage'
import { ProductForm } from '@/components/inventory/ProductForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit, Plus, Package, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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

    // Saving State
    const [isSaving, setIsSaving] = useState(false)
    const [saveProgress, setSaveProgress] = useState(0)
    const [saveStatus, setSaveStatus] = useState('')

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
            const fetchedProducts = await FirestoreProductsDs.getProducts()
            setOriginalItems(fetchedProducts)
            setItems(fetchedProducts.map(p => ({
                product: p,
                isNew: false,
                isDeleted: false,
                isDirty: false
            })))
            setDeletedIds(new Set())
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoadingProducts(false)
        }
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
            } else if (editingItemIndex !== null) {
                // Edit Existing
                const existing = newItems[editingItemIndex!];
                newItems[editingItemIndex!] = {
                    ...existing,
                    product: { ...productData, id: existing.product.id },
                    isDirty: true,
                    // Merge file changes if already dirty? For simplicity, we just overwrite file changes with latest form submission
                    // Note: If user edits twice, the last submission holds the pending files. 
                    // Complex merging of arrays might be needed if he added files, closed form, opened again.
                    // But ProductForm preserves 'previews' URLs.
                    // For file inputs, ProductForm doesn't remember previous file inputs on re-open unless we pass them back.
                    // Current ProductForm implementation handles 'previews' as URLs or Files. 
                    // If we close form, we lose the File objects inside ProductForm unless passed.
                    // Simplification: Form open/close clears unsaved file inputs inside form? 
                    // Ideally, we shouldn't close form until done, OR we pass files back to form.
                    // But here we are "Saving" to the staging area.
                    // So we store the files here.
                    fileChanges: {
                        thumbnail: thumbnailFile || (existing.fileChanges?.thumbnail || null), // If new file null, keep old pending if any? 
                        // Actually ProductForm onSuccess logic needs to be careful.
                        // We'll trust the form sends the *delta* or *complete state* of new files.
                        // Our Form sends `newPreviewFiles` (only the ones currently added).
                        // If I added files in previous edit, they are now "staged".
                        // Logic Gap: ProductForm seeing "staged" files.
                        // We will assume "Single Shot" means "Add Product" -> "Fill Form" -> "Submit to Stage".
                        // If I edit a Staged product, I might lose the previous staged files if the form doesn't see them.
                        // Fix strategy: If editing a staged item, we technically can't easily re-populate the file input.
                        // So, we might accept that re-editing a staged item resets its file inputs or we block re-editing files?
                        // Or we just append.
                        // Let's assume simplest: Overwrite.
                        newPreviews: [...(existing.fileChanges?.newPreviews || []), ...previewFiles],
                        deletedPreviews: [...(existing.fileChanges?.deletedPreviews || []), ...deletedPreviews]
                    }
                };
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
            // Filter changes
            const itemsToProcess = items.filter(i => i.isDirty || i.isDeleted || i.isNew);
            const totalSteps = itemsToProcess.length * 2; // rough estimate
            let completedSteps = 0;

            const updateProgress = (status: string) => {
                completedSteps++;
                setSaveProgress(Math.min(100, Math.round((completedSteps / totalSteps) * 100)));
                setSaveStatus(status);
            };

            // Process Deletions First
            const deletedItems = items.filter(i => i.isDeleted && !i.isNew);
            updateProgress(`Deleting ${deletedItems.length} items...`);

            for (const item of deletedItems) {
                // Delete images
                if (item.product.thumbnail) await deleteProductImage(item.product.thumbnail);
                for (const preview of item.product.previews) {
                    await deleteProductImage(preview);
                }
                // Delete doc
                await FirestoreProductsDs.deleteProduct(item.product.id);
            }

            // Process Updates / Creates
            const activeItems = items.filter(i => !i.isDeleted && (i.isDirty || i.isNew));

            for (const item of activeItems) {
                updateProgress(`Saving ${item.product.name}...`);

                let productData = { ...item.product };
                const fileChanges = item.fileChanges;

                // 1. Delete removed previews
                if (fileChanges?.deletedPreviews) {
                    for (const url of fileChanges.deletedPreviews) {
                        await deleteProductImage(url);
                    }
                }

                // 2. Upload Thumbnail
                if (fileChanges?.thumbnail) {
                    const url = await uploadProductImage(fileChanges.thumbnail, productData.name);
                    productData.thumbnail = url;
                    // Update previews array if it contained the old thumbnail or if we want to add the new one
                }

                // 3. Upload Previews
                if (fileChanges?.newPreviews) {
                    const uploadedPreviewUrls = [];
                    for (const p of fileChanges.newPreviews) {
                        // We need a unique name for preview to avoid conflict or overwrite
                        // We use the file name but sanitised? Or just a counter?
                        // "products/{name}/previews/{filename}"
                        // File objects have names.
                        const url = await uploadProductPreview(p.file, productData.name, p.name);
                        uploadedPreviewUrls.push(url);
                    }
                    productData.previews = [...productData.previews, ...uploadedPreviewUrls];
                }

                // 4. Save to Firestore
                // Remove temp ID if new
                if (item.isNew) {
                    const { id, ...data } = productData;
                    await FirestoreProductsDs.addProduct(data);
                } else {
                    const { id, ...data } = productData;
                    await FirestoreProductsDs.updateProduct(id, data);
                }
            }

            setSaveStatus('Complete!');
            setSaveProgress(100);

            // Reload
            await loadProducts();

        } catch (error) {
            console.error(error);
            alert('Error saving changes. Check console for details.');
        } finally {
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
                        <Button
                            onClick={saveChanges}
                            disabled={!hasUnsavedChanges || isSaving}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                        {/* List Active Items */}
                        {items.map((item, index) => {
                            if (item.isDeleted) return null;

                            const product = item.product;
                            const isDirty = item.isDirty || item.isNew;

                            return (
                                <Card
                                    key={product.id}
                                    className={`group relative flex flex-row md:flex-col bg-white overflow-hidden hover:shadow-lg transition-shadow border-2 ${isDirty ? 'border-amber-400' : 'border-transparent'}`}
                                >
                                    {/* Image Section */}
                                    <div className="relative w-[100px] h-[100px] md:w-full md:h-48 shrink-0 bg-gray-100 flex items-center justify-center">
                                        {/* Thumbnail / Icon */}
                                        {item.fileChanges?.thumbnail ? (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 bg-gray-200">New Img</div>
                                        ) : product.thumbnail ? (
                                            <img
                                                src={product.thumbnail}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Package className="h-8 w-8 text-gray-400" />
                                        )}

                                        {/* Mobile: Stock Badge Overlap */}
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

                                        {/* Header area */}
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 text-sm md:text-lg line-clamp-2 leading-tight md:leading-snug mb-1">
                                                    {product.name}
                                                </h3>

                                                {/* Badges (New/Modified) */}
                                                {(item.isNew || isDirty) && (
                                                    <div className="flex flex-wrap gap-1 mb-1">
                                                        {item.isNew && <Badge className="bg-blue-100 text-blue-800 text-[10px] px-1.5 h-4">New</Badge>}
                                                        {isDirty && !item.isNew && <Badge className="bg-amber-100 text-amber-800 text-[10px] px-1.5 h-4">Modified</Badge>}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Mobile: Edit Button (Top Right) */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="md:hidden h-8 w-8 -mt-2 -mr-2 text-gray-500 hover:text-primary"
                                                onClick={() => handleEditProduct(index)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Price */}
                                        <div className="mt-1 md:mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs md:text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
                                                <span className="text-sm md:text-lg font-bold text-green-600">₹{product.price.toFixed(2)}</span>
                                                <span className="text-[10px] md:text-xs text-green-700 bg-green-50 px-1 rounded ml-1">{product.discountPercent}% OFF</span>
                                            </div>
                                        </div>

                                        {/* Desktop: Spacer & Actions */}
                                        <div className="hidden md:flex flex-col gap-3 mt-4 flex-1 justify-end">
                                            <div className="flex justify-between items-center">
                                                {product.outOfStock ? (
                                                    <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>
                                                ) : (
                                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Stock</Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditProduct(index)}
                                                    className="flex-1"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDeleteToggle(index)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shrink-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Mobile: Delete Button (Bottom Right) */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden absolute bottom-1 right-1 h-8 w-8 text-red-400 hover:text-red-600"
                                            onClick={() => handleDeleteToggle(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>

                                    </div>
                                </Card>
                            );
                        })}

                        {/* Deleted Items Section (Move to bottom of grid or separate) */}
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
            </div>
        </div>
    )
}
