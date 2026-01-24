'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel'
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs'
import { deleteProductImage } from '@/lib/features/product/data/sources/ProductStorage'
import { ProductForm } from '@/components/inventory/ProductForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit, Plus, Package } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function InventoryPage() {
    const { user, loading, isAdmin } = useAuth()
    const router = useRouter()
    const [products, setProducts] = useState<ProductModel[]>([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<ProductModel | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

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

    const loadProducts = async () => {
        try {
            setLoadingProducts(true)
            const fetchedProducts = await FirestoreProductsDs.getProducts()
            setProducts(fetchedProducts)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoadingProducts(false)
        }
    }

    const handleAddProduct = () => {
        setEditingProduct(null)
        setIsFormOpen(true)
    }

    const handleEditProduct = (product: ProductModel) => {
        setEditingProduct(product)
        setIsFormOpen(true)
    }

    const handleDeleteProduct = async (product: ProductModel) => {
        if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
            return
        }

        try {
            setDeletingId(product.id)
            
            if (product.thumbnail) {
                await deleteProductImage(product.thumbnail)
            }
            
            await FirestoreProductsDs.deleteProduct(product.id)
            await loadProducts()
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Failed to delete product')
        } finally {
            setDeletingId(null)
        }
    }

    const handleFormSuccess = async () => {
        setIsFormOpen(false)
        setEditingProduct(null)
        await loadProducts()
    }

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Inventory Management</h1>
                    <Button onClick={handleAddProduct} className="bg-primary text-white hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>

                {loadingProducts ? (
                    <Card className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </Card>
                ) : products.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-4">No products yet</p>
                        <Button onClick={handleAddProduct} className="bg-primary text-white hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <Card
                                key={product.id}
                                className="p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            {product.thumbnail ? (
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    className="w-20 h-15 object-cover rounded border"
                                                />
                                            ) : (
                                                <div className="w-20 h-15 bg-gray-100 rounded border flex items-center justify-center">
                                                    <Package className="h-8 w-8 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-lg text-slate-900">{product.name}</h3>
                                                <p className="text-sm text-gray-500">ID: {product.id}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>Original Price: <span className="text-slate-900 line-through">₹{product.originalPrice.toFixed(2)}</span></p>
                                            <p>Final Price: <span className="text-green-600 font-bold text-lg">₹{product.price.toFixed(2)}</span></p>
                                            <p>Discount: <Badge className="bg-green-100 text-green-800 border-green-200">{product.discountPercent}% OFF</Badge></p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div>
                                            {product.outOfStock ? (
                                                <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>
                                            ) : (
                                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Stock</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditProduct(product)}
                                                className="flex-1"
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteProduct(product)}
                                                disabled={deletingId === product.id}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            >
                                                {deletingId === product.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </DialogTitle>
                        </DialogHeader>
                        <ProductForm
                            product={editingProduct}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
