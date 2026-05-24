'use client'

import { useState } from 'react'
import { Play, Volume2, VolumeX, Sparkles, Flame, Rocket, Bomb, Target, Zap, Gift, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CategoryBannerProps {
    category: string
    productCount: number
    categoryId: string
    children?: React.ReactNode
}

const categoryConfig = {
    sparklers: {
        icon: Sparkles,
        gradient: 'from-yellow-400 to-orange-500',
        bgGradient: 'from-yellow-50 to-orange-50',
        borderColor: 'border-yellow-200',
        title: 'Sparklers',
        description: 'Traditional sparklers with bright and colorful effects',
        videoId: 'dQw4w9WgXcQ' // Replace with actual sparkler video ID
    },
    flowerPots: {
        icon: Flame,
        gradient: 'from-red-400 to-pink-500',
        bgGradient: 'from-red-50 to-pink-50',
        borderColor: 'border-red-200',
        title: 'Flower Pots',
        description: 'Traditional flower pots with vibrant colors and effects',
        videoId: 'dQw4w9WgXcQ' // Replace with actual flower pot video ID
    },
    bombs: {
        icon: Bomb,
        gradient: 'from-purple-400 to-indigo-500',
        bgGradient: 'from-purple-50 to-indigo-50',
        borderColor: 'border-purple-200',
        title: 'Bombs',
        description: 'Powerful bombs and crackers for grand celebrations',
        videoId: 'dQw4w9WgXcQ' // Replace with actual bomb video ID
    },
    groundchakkar: {
        icon: Target,
        gradient: 'from-green-400 to-teal-500',
        bgGradient: 'from-green-50 to-teal-50',
        borderColor: 'border-green-200',
        title: 'Ground Chakkar',
        description: 'Ground chakkar big, special & whizzling wheels',
        videoId: 'dQw4w9WgXcQ' // Replace with actual ground chakkar video ID
    },
    rockets: {
        icon: Rocket,
        gradient: 'from-blue-400 to-cyan-500',
        bgGradient: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-200',
        title: 'Rockets',
        description: 'High-flying rockets with spectacular aerial displays',
        videoId: 'dQw4w9WgXcQ' // Replace with actual rocket video ID
    },
    aerialshot: {
        icon: Zap,
        gradient: 'from-indigo-400 to-purple-500',
        bgGradient: 'from-indigo-50 to-purple-50',
        borderColor: 'border-indigo-200',
        title: 'Aerial Shot',
        description: '7 to 240 multicolour shots & night aerial',
        videoId: 'dQw4w9WgXcQ' // Replace with actual aerial shot video ID
    },
    childrenNovelty: {
        icon: Package,
        gradient: 'from-pink-400 to-rose-500',
        bgGradient: 'from-pink-50 to-rose-50',
        borderColor: 'border-pink-200',
        title: 'Children Novelty',
        description: 'Kids special items',
        videoId: 'dQw4w9WgXcQ' // Replace with actual children novelty video ID
    },
    peacocks: {
        icon: Flame,
        gradient: 'from-emerald-400 to-green-500',
        bgGradient: 'from-emerald-50 to-green-50',
        borderColor: 'border-emerald-200',
        title: 'Peacocks',
        description: 'Peacock red & green',
        videoId: 'dQw4w9WgXcQ'
    },
    bijili: {
        icon: Zap,
        gradient: 'from-yellow-400 to-amber-500',
        bgGradient: 'from-yellow-50 to-amber-50',
        borderColor: 'border-yellow-200',
        title: 'Bijili Crackers',
        description: 'Red & stripped bijili',
        videoId: 'dQw4w9WgXcQ'
    },
    twinklingstar: {
        icon: Sparkles,
        gradient: 'from-blue-400 to-indigo-500',
        bgGradient: 'from-blue-50 to-indigo-50',
        borderColor: 'border-blue-200',
        title: 'Twinkling Star',
        description: '1.5" & 4" twinkling stars',
        videoId: 'dQw4w9WgXcQ'
    },
    pencil: {
        icon: Rocket,
        gradient: 'from-orange-400 to-red-500',
        bgGradient: 'from-orange-50 to-red-50',
        borderColor: 'border-orange-200',
        title: 'Pencil Shots',
        description: '15" navrang pencil',
        videoId: 'dQw4w9WgXcQ'
    },
    saravadi: {
        icon: Bomb,
        gradient: 'from-orange-400 to-yellow-500',
        bgGradient: 'from-orange-50 to-yellow-50',
        borderColor: 'border-orange-200',
        title: 'Saravadi',
        description: '2 sound to 240 shots',
        videoId: 'dQw4w9WgXcQ'
    },
    whistlingfountain: {
        icon: Flame,
        gradient: 'from-cyan-400 to-blue-500',
        bgGradient: 'from-cyan-50 to-blue-50',
        borderColor: 'border-cyan-200',
        title: 'Whistling Fountain',
        description: 'Electric stone & snake egg',
        videoId: 'dQw4w9WgXcQ'
    },
    cracklingfountain: {
        icon: Sparkles,
        gradient: 'from-pink-400 to-rose-500',
        bgGradient: 'from-pink-50 to-rose-50',
        borderColor: 'border-pink-200',
        title: 'Crackling Fountain',
        description: 'Colour, crackling, mega & double wonder fountains',
        videoId: 'dQw4w9WgXcQ'
    },
    digitalwala: {
        icon: Zap,
        gradient: 'from-green-400 to-emerald-500',
        bgGradient: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-200',
        title: 'Digital Wala',
        description: 'Digital crackers',
        videoId: 'dQw4w9WgXcQ'
    },
    giftbox: {
        icon: Gift,
        gradient: 'from-amber-400 to-orange-500',
        bgGradient: 'from-amber-50 to-orange-50',
        borderColor: 'border-amber-200',
        title: 'Gift Boxes',
        description: '25 to 50 items boxes',
        videoId: 'dQw4w9WgXcQ'
    }
}

export function CategoryBanner({ category, productCount, categoryId, children }: CategoryBannerProps) {
    const [isMuted, setIsMuted] = useState(true)
    const [showVideo, setShowVideo] = useState(false)
    
    const config = categoryConfig[category.toLowerCase() as keyof typeof categoryConfig] || categoryConfig.sparklers
    const Icon = config.icon

    const handlePlayVideo = () => {
        setShowVideo(true)
    }

    const handleCloseVideo = () => {
        setShowVideo(false)
    }

    return (
        <>
            <section id={`category-${categoryId}`} className="mb-12 scroll-mt-20">
                {/* Enhanced Category Banner */}
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor} shadow-2xl mb-8`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-red-500/20 to-yellow-400/20"></div>
                    
                    {/* Diwali-themed Background Pattern */}
                    <div className="absolute inset-0 opacity-15">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 40c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm40 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm40-40c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                    </div>
                    
                    {/* Diwali Sparkle Overlay */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <div className="absolute top-8 right-8 w-1 h-1 bg-orange-400 rounded-full animate-pulse delay-75"></div>
                        <div className="absolute bottom-12 left-12 w-2 h-2 bg-red-400 rounded-full animate-pulse delay-150"></div>
                        <div className="absolute bottom-8 right-4 w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-300"></div>
                        <div className="absolute top-16 left-32 w-1 h-1 bg-orange-300 rounded-full animate-pulse delay-500"></div>
                        <div className="absolute bottom-20 right-20 w-2 h-2 bg-red-300 rounded-full animate-pulse delay-700"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Left Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${config.gradient} text-white shadow-lg`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <Badge className="bg-white/20 text-white border-white/30">
                                        {productCount} Products
                                    </Badge>
                                </div>
                                
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                    {config.title}
                                </h2>
                                
                                <p className="text-lg text-gray-700 mb-6 max-w-2xl bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    {config.description}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        onClick={handlePlayVideo}
                                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        Watch Demo
                                    </Button>
                                    
                                    <Button
                                        variant="outline"
                                        className="border-gray-300 hover:bg-gray-50"
                                        onClick={() => {
                                            const element = document.getElementById(`category-${categoryId}-products`)
                                            element?.scrollIntoView({ behavior: 'smooth' })
                                        }}
                                    >
                                        View Products
                                    </Button>
                                </div>
                            </div>

                            {/* Right Content - Video Preview */}
                            <div className="flex-shrink-0">
                                <div className="relative group">
                                    <div className="w-64 h-40 md:w-80 md:h-48 rounded-xl overflow-hidden shadow-xl">
                                        {showVideo ? (
                                            <div className="relative w-full h-full">
                                                <iframe
                                                    className="w-full h-full"
                                                    src={`https://www.youtube.com/embed/${config.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0`}
                                                    title={`${config.title} Demo`}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                                <Button
                                                    onClick={handleCloseVideo}
                                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                                                    size="sm"
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center cursor-pointer group"
                                                 onClick={handlePlayVideo}>
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                                                <div className="relative z-10 flex flex-col items-center text-white">
                                                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                        <Play className="w-6 h-6 ml-1" />
                                                    </div>
                                                    <span className="text-sm font-medium">Watch Demo</span>
                                                </div>
                                                <img
                                                    src={`https://img.youtube.com/vi/${config.videoId}/maxresdefault.jpg`}
                                                    alt={`${config.title} preview`}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Sound Toggle */}
                                    {showVideo && (
                                        <Button
                                            onClick={() => setIsMuted(!isMuted)}
                                            className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                                            size="sm"
                                        >
                                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-2xl"></div>
                </div>

                {/* Products Grid */}
                <div id={`category-${categoryId}-products`}>
                    {children}
                </div>
            </section>

            {/* Video Modal (Optional - for larger video viewing) */}
            {showVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                     onClick={handleCloseVideo}>
                    <div className="relative w-full max-w-4xl aspect-video"
                         onClick={(e) => e.stopPropagation()}>
                        <iframe
                            className="w-full h-full rounded-lg"
                            src={`https://www.youtube.com/embed/${config.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0`}
                            title={`${config.title} Demo`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <Button
                            onClick={handleCloseVideo}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                            size="sm"
                        >
                            ×
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}
