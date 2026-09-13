"use client";

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  fallbackSrc?: string;
}

function BlurPlaceholder() {
    return <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />;
}

interface FallbackImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}

function FallbackImage({ src, alt, width, height, className }: FallbackImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            className={cn(
                "w-full h-full object-contain transition-opacity duration-300 opacity-100",
                className
            )}
            style={{
                objectPosition: 'center',
                padding: '4px'
            }}
        />
    );
}

export function OptimizedImage({
    src,
    alt,
    className,
    width,
    height,
    priority = false,
    placeholder = 'blur',
    fallbackSrc = '/logo.png'
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || !containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px', // Start loading 200px before image comes into view for better UX
                threshold: 0.01
            }
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [priority]);

    // Handle image load
    const handleLoad = () => {
        setIsLoaded(true);
    };

    // Handle image error
    const handleError = () => {
        setHasError(true);
        setIsLoaded(true); // Still consider it "loaded" to remove placeholder
        console.error('Product thumbnail failed to load:', src);
    };

    // Handle cached images that already loaded before the onLoad listener attached
    /* eslint-disable react-hooks/set-state-in-effect */
    useLayoutEffect(() => {
        if (imgRef.current) {
            if (imgRef.current.complete) {
                if (imgRef.current.naturalWidth === 0) {
                    setHasError(true);
                }
                setIsLoaded(true);
            }
        }
    }, [src, isInView]);
    /* eslint-enable react-hooks/set-state-in-effect */

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden", className)}
            style={{ width, height }}
        >
            {/* Placeholder */}
            {!isLoaded && placeholder === 'blur' && <BlurPlaceholder />}

            {/* Actual Image */}
            {isInView && !hasError && src && (
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        "w-full h-full object-contain transition-opacity duration-300",
                        isLoaded ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                        objectPosition: 'center',
                        padding: '4px'
                    }}
                />
            )}

            {/* Error State */}
            {hasError && (
                <FallbackImage
                    src={fallbackSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    className={className}
                />
            )}
        </div>
    );
}
