"use client";

import { useState } from 'react';
import { Sparkles, Shield, Truck, Award } from 'lucide-react';

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-black py-6 sm:py-8 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-8 left-8 w-16 h-16 bg-yellow-400/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-8 right-16 w-20 h-20 bg-yellow-400/30 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Main Content - Compact with Highlights */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="text-center">
          {/* Compact Festival Badge */}
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-yellow-400 text-black px-3 py-1 sm:px-4 sm:py-1 rounded-full text-xs sm:text-sm font-bold mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            DIWALI SPECIAL
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>

          {/* Main Heading - Mobile First */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            <span className="text-yellow-400">GANISHKHASRI</span>
            <br />
            CRACKERS
          </h1>

          {/* Short Tagline */}
          <p className="text-sm sm:text-base text-yellow-100 mb-6 max-w-xl mx-auto">
            Premium Quality Firecrackers • Trusted Across India
          </p>

          {/* 3 Key Highlights - Compact */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-xs sm:text-sm font-bold text-yellow-400">Premium Quality</div>
              <div className="text-xs text-white hidden sm:block">Finest Materials</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-xs sm:text-sm font-bold text-yellow-400">100% Safe</div>
              <div className="text-xs text-white hidden sm:block">ISO Certified</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-xs sm:text-sm font-bold text-yellow-400">Fast Delivery</div>
              <div className="text-xs text-white hidden sm:block">Pan India</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
