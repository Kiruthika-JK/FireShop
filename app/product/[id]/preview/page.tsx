'use client'

import { useState, useRef, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { mergeClasses } from '@/lib/utils'

interface ProductPreviewPageProps {
    params: Promise<{ id: string }>
}

export default function ProductPreviewPage({ params }: ProductPreviewPageProps) {
    // We still have the `id` from params but we don't strictly need it for data fetching anymore
    const { id } = use(params)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Read all 'url' parameters
    const previews = searchParams.getAll('url')

    const [activeIndex, setActiveIndex] = useState(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Handle scroll to update active index
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current
            const index = Math.round(scrollLeft / clientWidth)
            setActiveIndex(index)
        }
    }

    const isVideo = (url: string) => url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm')

    if (!previews || previews.length === 0) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white relative">
                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                >
                    <X className="w-6 h-6" />
                </button>
                <p>No previews available</p>
            </div>
        )
    }

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
