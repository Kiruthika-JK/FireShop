'use client'

import { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MediaCarouselProps {
    isOpen: boolean
    onClose: () => void
    images: string[]
    videoId?: string
    videoTitle?: string
    productName: string
}

const getYouTubeEmbedUrl = (videoId: string, autoplay: boolean, muted: boolean) => {
    // Use standard YouTube embed format that works for both videos and shorts
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&rel=0&showinfo=0&controls=1&modestbranding=1&playsinline=1`
}

export function MediaCarousel({ isOpen, onClose, images, videoId, videoTitle, productName }: MediaCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    // Calculate total media items (images + video)
    const totalItems = images.length + (videoId ? 1 : 0)

    // Keep a ref of the latest currentIndex so navigation callbacks don't need it as a dependency
    const currentIndexRef = useRef(currentIndex)
    useEffect(() => {
        currentIndexRef.current = currentIndex
    }, [currentIndex])

    const updatePlayStateForIndex = useCallback((index: number) => {
        if (videoId && images.length > 0 && index === images.length) {
            // Landed on the video slide, keep the existing play state
            return
        }
        setIsPlaying(false)
    }, [images.length, videoId])

    const navigate = useCallback((direction: 'prev' | 'next') => {
        setIsLoading(true)
        const next = direction === 'prev'
            ? (currentIndexRef.current - 1 + totalItems) % totalItems
            : (currentIndexRef.current + 1) % totalItems
        setCurrentIndex(next)
        updatePlayStateForIndex(next)
    }, [totalItems, updatePlayStateForIndex])

    const goToIndex = useCallback((index: number) => {
        setIsLoading(true)
        setCurrentIndex(index)
        updatePlayStateForIndex(index)
    }, [updatePlayStateForIndex])

    // Reset index when modal opens/closes
    /* eslint-disable react-hooks/set-state-in-effect */
    useLayoutEffect(() => {
        if (isOpen) {
            setCurrentIndex(0)
            setIsPlaying(false)
        }
    }, [isOpen])
    /* eslint-enable react-hooks/set-state-in-effect */

    // Handle keyboard navigation using refs so the listener is only attached once per open state
    const navigateRef = useRef(navigate)
    const onCloseRef = useRef(onClose)

    useEffect(() => {
        navigateRef.current = navigate
    }, [navigate])

    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return

            switch (e.key) {
                case 'ArrowLeft':
                    navigateRef.current('prev')
                    break
                case 'ArrowRight':
                    navigateRef.current('next')
                    break
                case 'Escape':
                    onCloseRef.current()
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    const isVideo = videoId && currentIndex === images.length
    const currentImage = !isVideo && images[currentIndex]

    const handleVideoStateChange = () => {
        console.log('MediaCarousel - Video iframe loaded:', videoId)
        setIsLoading(false)
    }

    const handleVideoError = () => {
        console.error('MediaCarousel - Failed to load YouTube video:', videoId)
        setIsLoading(false)
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                    <div className="relative w-full max-w-6xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900">{productName}</h3>
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                size="sm"
                                className="rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Main Media Display */}
                        <div className="relative w-full bg-black flex-shrink-0 flex items-center justify-center" style={{ minHeight: '300px', maxHeight: '50vh' }}>
                            {isVideo ? (
                                <div className="relative w-full h-full">
                                    <iframe
                                        className="w-full h-full"
                                        src={getYouTubeEmbedUrl(videoId, isPlaying, isMuted)}
                                        title={videoTitle || `${productName} Demo`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        onLoad={handleVideoStateChange}
                                        onError={handleVideoError}
                                    />
                                    
                                    {/* Video Controls */}
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <Button
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                                            size="sm"
                                        >
                                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        </Button>
                                        <Button
                                            onClick={() => setIsMuted(!isMuted)}
                                            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                                            size="sm"
                                        >
                                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    {currentImage && (
                                        <img
                                            src={currentImage}
                                            alt={`${productName} - Image ${currentIndex + 1}`}
                                            className="max-w-full max-h-[calc(50vh-32px)] object-contain"
                                            onLoad={() => setIsLoading(false)}
                                            onError={(e) => {
                                                const img = e.target as HTMLImageElement;
                                                if (currentImage.includes('firebasestorage.googleapis.com')) {
                                                    const fixedUrl = currentImage.includes('?') 
                                                        ? `${currentImage}&alt=media`
                                                        : `${currentImage}?alt=media`;
                                                    img.src = fixedUrl;
                                                } else {
                                                    setIsLoading(false);
                                                }
                                            }}
                                        />
                                    )}
                                    
                                    {/* Loading Indicator */}
                                    {isLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Navigation Controls */}
                        {totalItems > 1 && (
                            <>
                                {/* Previous Button */}
                                <Button
                                    onClick={() => navigate('prev')}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                                    size="sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>

                                {/* Next Button */}
                                <Button
                                    onClick={() => navigate('next')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                                    size="sm"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </>
                        )}

                        {/* Thumbnail Strip */}
                        {totalItems > 1 && (
                            <div className="p-4 border-t">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {/* Image Thumbnails */}
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToIndex(index)}
                                            className={cn(
                                                "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                                                currentIndex === index
                                                    ? "border-blue-500 ring-2 ring-blue-200"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <img
                                                src={image}
                                                alt={`${productName} - Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const img = e.target as HTMLImageElement;
                                                    if (image.includes('firebasestorage.googleapis.com')) {
                                                        const fixedUrl = image.includes('?') 
                                                            ? `${image}&alt=media`
                                                            : `${image}?alt=media`;
                                                        img.src = fixedUrl;
                                                    }
                                                }}
                                            />
                                        </button>
                                    ))}
                                    
                                    {/* Video Thumbnail */}
                                    {videoId && (
                                        <button
                                            onClick={() => goToIndex(images.length)}
                                            className={cn(
                                                "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative",
                                                currentIndex === images.length
                                                    ? "border-blue-500 ring-2 ring-blue-200"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <img
                                                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                                alt={`${productName} - Video`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-video.jpg'
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Play className="w-6 h-6 text-white" />
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Media Info */}
                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>
                                    {isVideo ? 'Video' : `Image ${currentIndex + 1}`} of {totalItems}
                                </span>
                                {isVideo && (
                                    <span className="flex items-center gap-2">
                                        <Play className="w-4 h-4" />
                                        {videoTitle || 'Product Demo'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
