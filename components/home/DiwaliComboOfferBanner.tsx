'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiwaliComboOfferBannerProps {
  productCount: number;
}

export function DiwaliComboOfferBanner({ productCount }: DiwaliComboOfferBannerProps) {
    const handleClick = () => {
        if (typeof window === 'undefined') return;
        const targetId = 'category-diwali-combo-offer';
        history.pushState(null, '', `#${targetId}`);
        const element = document.getElementById(targetId);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 mb-4">
            <div className="max-w-4xl mx-auto relative overflow-hidden rounded-xl bg-orange-600 text-white shadow-xl py-5 px-4 sm:py-6 sm:px-5 border-2 border-yellow-300 ring-2 ring-yellow-400/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold truncate drop-shadow-md">
                            Diwali Combo Offer 2026
                        </h3>
                        <p className="text-sm opacity-90 truncate drop-shadow-sm">
                            {productCount} super offer combo packs
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleClick}
                        className="bg-white text-orange-600 hover:bg-yellow-50 font-semibold shadow-sm shrink-0 text-xs sm:text-sm"
                    >
                        View
                    </Button>
                </div>
            </div>
        </div>
    );
}
