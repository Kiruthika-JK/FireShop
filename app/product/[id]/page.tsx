'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/features/cart/store'
import { formatPrice } from '@/lib/utils'
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs'
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel'
import { AddToCartButton } from '../../../components/products/AddToCartButton'

interface ProductPageProps {
  params: {
    id: string
  }
  searchParams: {
    url?: string[]
  }
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const product = await FirestoreProductsDs.getProductById(params.id)

  if (!product) {
    notFound()
  }

  const imageUrl = searchParams.url?.[0] || product.thumbnail

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(product.structuredData || {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": `Premium quality ${product.category} from Sivakasi`,
            "brand": "Ganishkha Crackers",
            "category": "Fireworks",
            "offers": {
              "@type": "Offer",
              "price": product.price.toString(),
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
            }
          })
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <div className="relative aspect-square">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  {product.discountPercent && product.discountPercent > 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-500 text-white">
                        {product.discountPercent}% OFF
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>

              {/* Preview Images */}
              {product.previews && product.previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.previews.map((preview, index) => (
                    <Link
                      key={index}
                      href={`/product/${product.id}?url=${encodeURIComponent(preview)}`}
                    >
                      <Card className="overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all">
                        <div className="relative aspect-square">
                          <Image
                            src={preview}
                            alt={`${product.name} preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-gray-600">
                  {product.content}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-orange-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge className="bg-green-500 text-white">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </Badge>
                  </>
                )}
              </div>

              {/* Category */}
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Badge>
                {product.outOfStock && (
                  <Badge className="bg-red-500 text-white">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-orange">
                <h3 className="text-lg font-semibold mb-2">Product Description</h3>
                <p className="text-gray-700">
                  Premium quality {product.category} from Sivakasi, perfect for Diwali and festival celebrations. 
                  Our crackers are manufactured with the highest safety standards and deliver amazing visual effects.
                </p>
                <p className="text-gray-700">
                  {product.seoDescription || `Buy ${product.name} at best price in Sivakasi. Fast delivery across Tamil Nadu and India.`}
                </p>
              </div>

              {/* Safety Information */}
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">Safety Information</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>Keep away from children</li>
                  <li>Use in open spaces only</li>
                  <li>Maintain safe distance while lighting</li>
                  <li>Store in cool, dry place</li>
                </ul>
              </Card>

              {/* Add to Cart Button */}
              <AddToCartButton product={product} />

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl mb-1">Delivery</div>
                  <div className="text-sm text-gray-600">Across India</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">Quality</div>
                  <div className="text-sm text-gray-600">Premium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">Safety</div>
                  <div className="text-sm text-gray-600">Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
