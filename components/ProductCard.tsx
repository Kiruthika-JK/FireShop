'use client'

import { useRef, useState } from 'react'
import { Plus, Minus, Sparkles, Play, TrendingUp, Flame } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { useCartStore } from '@/lib/features/cart/store'
import { mergeClasses, formatPrice } from '@/lib/utils'
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel'
import { MediaCarousel } from '@/components/ui/MediaCarousel'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { getTamilNames, getTamilProductNames } from '@/lib/data/tamilCrackerNames';

interface ProductCardProps {
    product: ProductModel
    className?: string
    variant?: 'purchase' | 'checkout' | 'compact'
}

export function ProductCard({ product, className, variant = 'purchase' }: ProductCardProps) {
    const router = useRouter()
    const { items, addItem, updateQuantity, removeItem } = useCartStore()
    const cartItem = items.find((i) => i.productId === product.id)
    const quantity = cartItem ? cartItem.quantity : 0
    const [showCarousel, setShowCarousel] = useState(false)

    // Get Tamil names for SEO
    const tamilCategoryNames = getTamilNames(product.category);
    const tamilProductNames = getTamilProductNames(product.name);
    const seoFriendlyName = `${product.name} ${tamilProductNames.join(' ')} ${product.category} ${tamilCategoryNames.join(' ')}`;
    const altText = `${product.name} - ${tamilProductNames.join(', ')} - ${product.category} - ${tamilCategoryNames.join(', ')}`;

    const handleIncrement = (event?: React.MouseEvent) => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            quantity: 1,
            thumbnail: product.thumbnail
        });
    }

    const timerRef = useRef<any>(null);
    const isLongPress = useRef(false);

    const handleLongPressStart = () => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            removeItem(product.id);
        }, 600);
    };

    const handleLongPressEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    const handleDecrementClick = () => {
        if (isLongPress.current) {
            return;
        }
        handleDecrement();
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            if (quantity === 1) {
                removeItem(product.id)
            } else {
                updateQuantity(product.id, quantity - 1)
            }
        }
    }

    // Purchase Variant Content (Browsing)
    const renderPurchaseContent = () => (
        <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
            {product.originalPrice && <span className="text-gray-500 line-through truncate">₹{formatPrice(product.originalPrice)}</span>}
            <span className="text-green-600 font-bold truncate">₹{formatPrice(product.price)}</span>
        </div>
    )

    // Checkout Variant Content (Cart)
    const renderCheckoutContent = () => (
        <div className="flex items-center justify-between w-full mt-1">
            <div className="text-xs text-gray-500">
                ¥{formatPrice(product.price)} × {quantity}
            </div>
            <div className="text-green-600 font-bold">
                ¥{formatPrice(product.price * (quantity || 1))}
            </div>
        </div>
    )

    return (
        <>
        <Card 
          className={mergeClasses("overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white border-input p-0 transform hover:scale-105 hover:border-yellow-400/50 relative", className)}
          data-category={product.category}
          data-tamil-category={tamilCategoryNames.join(',')}
          data-tamil-product={tamilProductNames.join(',')}
          data-seo-name={seoFriendlyName}
        >
            {/* Special tags */}
            <div className="absolute top-2 right-2 z-10">
                {product.category === 'specialcelebrationfunction' && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-2 py-1 rounded-full flex items-center gap-1 animate-pulse shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs font-bold">Our Special</span>
                    </div>
                )}
                {product.trending && product.category !== 'specialcelebrationfunction' && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                        <Flame className="w-3 h-3" />
                        <span className="text-xs font-bold">Best Seller</span>
                    </div>
                )}
            </div>
            
            <div className={`flex ${variant === 'compact' ? 'flex-col sm:flex-col' : 'flex-row sm:flex-col'} h-full bg-white rounded-xl ${variant === 'compact' ? 'p-2 sm:p-2' : 'p-3 sm:p-0'} gap-${variant === 'compact' ? '2' : '4'} sm:gap-0 items-center sm:items-stretch`}>
                {/* Image Container */}
                <div
                    className={`relative shrink-0 ${variant === 'compact' ? 'w-full h-20 sm:h-24' : 'w-[100px] h-[100px] sm:w-full sm:h-48'} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 ${variant === 'compact' ? 'rounded-lg' : 'rounded-lg sm:rounded-none'} overflow-hidden cursor-pointer group`}
                    onClick={() => {
                        // Show media carousel instead of navigating to preview page
                        setShowCarousel(true)
                    }}
                >
                    {product.thumbnail ? (
                        <OptimizedImage
                            src={product.thumbnail}
                            alt={altText}
                            className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 transition-transform duration-300 group-hover:scale-105"
                            priority={true}
                            placeholder="blur"
                        />
                    ) : (
                        <span className="text-xs sm:text-lg opacity-50">600 × 400</span>
                    )}
                    
                    {/* Video Indicator */}
                    {product.youtubeVideoId && (
                        <div className="absolute top-2 left-2 z-10">
                            <div className="bg-red-500 text-white rounded-full p-1.5 shadow-lg">
                                <Play className="w-3 h-3" />
                            </div>
                        </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className={`flex-1 flex flex-row sm:flex-col justify-between items-center sm:items-start ${variant === 'compact' ? 'p-1 sm:p-2' : 'p-3 sm:p-5'} w-full ${product.trending ? 'bg-gradient-to-br from-orange-50/50 to-red-50/50' : ''}`}>
                    {variant === 'purchase' || variant === 'compact' ? (
                        <>
                            <div className="flex flex-col gap-1 text-left w-full h-full justify-between">
                                <div className="text-center">
                                    <h3 className={`${variant === 'compact' ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 ${variant === 'compact' ? 'line-clamp-1' : 'line-clamp-2'}`} title={seoFriendlyName}>
                                      {product.name}
                                      {tamilProductNames.length > 0 && variant !== 'compact' && (
                                        <span className="block text-xs text-gray-600 mt-1">
                                          {tamilProductNames[0]}
                                        </span>
                                      )}
                                    </h3>
                                    {variant === 'compact' ? (
                                        <div className="flex flex-col items-center gap-1 text-xs w-full">
                                            {product.originalPrice && <span className="text-gray-500 line-through text-xs">₹{formatPrice(product.originalPrice)}</span>}
                                            <span className="text-green-600 font-bold text-xs">₹{formatPrice(product.price)}</span>
                                        </div>
                                    ) : (
                                        renderPurchaseContent()
                                    )}
                                </div>
                            </div>

                            <div className={`flex items-center ${variant === 'compact' ? 'gap-1 sm:gap-2' : 'gap-3'} mt-0 sm:mt-4 sm:ml-0 ml-auto sm:w-full sm:justify-between`}>
                                <div className={`flex items-center ${variant === 'compact' ? 'gap-1 sm:gap-2' : 'gap-2'} sm:ml-auto`}>
                                    <AnimatedButton
                                        variant="outline"
                                        size="icon"
                                        className={`${variant === 'compact' ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-8 w-8'} rounded-full border-slate-400 bg-transparent hover:bg-slate-200 text-slate-700 select-none hover:scale-110 transition-transform`}
                                        onClick={handleDecrementClick}
                                        onMouseDown={handleLongPressStart}
                                        onMouseUp={handleLongPressEnd}
                                        onMouseLeave={handleLongPressEnd}
                                        onTouchStart={handleLongPressStart}
                                        onTouchEnd={handleLongPressEnd}
                                        disabled={quantity === 0}
                                    >
                                        <Minus className={`${variant === 'compact' ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </AnimatedButton>
                                    <span className={`w-${variant === 'compact' ? '3 sm:w-4' : '4'} text-center font-medium text-slate-900 font-bold ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>{quantity}</span>
                                    <AnimatedButton
                                        variant="outline"
                                        size="icon"
                                        className={`${variant === 'compact' ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-8 w-8'} rounded-full border-slate-400 bg-transparent hover:bg-slate-200 text-slate-700 hover:scale-110 transition-transform`}
                                        onClick={(e) => handleIncrement(e)}
                                    >
                                        <Plus className={`${variant === 'compact' ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </AnimatedButton>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Checkout Variant Layout
                        <div className={`flex flex-col w-full h-full justify-center ${product.trending ? 'bg-gradient-to-br from-orange-50/50 to-red-50/50' : ''}`}>
                            <h3 className="font-semibold text-slate-800 text-xs mb-1">{product.name}</h3>
                            <h3 className="font-semibold text-slate-800 text-xs sm:text-sm mb-1">{product.name}</h3>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <>
                                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                    </span>
                                  </>
                                )}
                              </div>
                              {/* Tamil category name for SEO */}
                              {tamilCategoryNames.length > 0 && (
                                <div className="text-center mt-1">
                                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                    {tamilCategoryNames[0]}
                                  </span>
                                </div>
                              )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
        
        {/* Media Carousel Modal */}
        <MediaCarousel
            isOpen={showCarousel}
            onClose={() => setShowCarousel(false)}
            images={product.previews || []}
            videoId={product.youtubeVideoId}
            videoTitle={product.videoTitle}
            productName={product.name}
        />
        
                </>
    )
}
