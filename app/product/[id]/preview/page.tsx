'use client'

import { useState, useRef, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { StaticProductsDs } from '@/lib/features/product/data/sources/StaticProductsDs'
import { mergeClasses } from '@/lib/utils'

interface ProductPreviewPageProps {
    params: Promise<{ id: string }>
}

export default function ProductPreviewPage({ params }: ProductPreviewPageProps) {
    const { id } = use(params)
    const router = useRouter()
    const product = StaticProductsDs.PRODUCTS.find((p) => p.id === id)

    // State for tracking active index
    const [activeIndex, setActiveIndex] = useState(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    if (!product) {
        return <div className="h-screen w-screen flex items-center justify-center bg-black text-white">Product not found</div>
    }

    const { previews } = product

    // Handle scroll to update active index
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current
            const index = Math.round(scrollLeft / clientWidth)
            setActiveIndex(index)
        }
    }

    const isVideo = (url: string) => url.toLowerCase().endsWith('.mp4')

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden">
            {/* Close Button - Float Top Left */}
            <button
                onClick={() => router.back()}
                className="absolute top-6 left-6 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Carousel Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
                style={{ scrollBehavior: 'smooth' }}
            >
                {previews.map((url, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-screen h-full snap-center flex items-center justify-center bg-transparent"
                    >
                        {isVideo(url) ? (
                            <video
                                src={url}
                                className="w-full h-full object-contain"
                                controls
                                playsInline
                                autoPlay
                                loop
                                muted // Muted for autoplay policy, usually better UX for previews
                            />
                        ) : (
                            <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Indicator - Bottom Center */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2 p-2 rounded-full bg-black/30 backdrop-blur-md">
                {previews.map((_, index) => (
                    <div
                        key={index}
                        className={mergeClasses(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            index === activeIndex ? "bg-white w-4" : "bg-white/50"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
