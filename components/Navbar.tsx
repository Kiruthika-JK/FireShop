"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/features/cart/store";
import { LoginModal } from "@/components/auth/LoginModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Home, Flame, Menu, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useBestSellers } from "@/lib/best-sellers-context";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const { items } = useCartStore();
  const { showBestSellersOnly, setShowBestSellersOnly } = useBestSellers();
  const hasCartItems = items.length > 0;

  // Hide Navbar on Product Preview page
  if (pathname?.includes("/preview")) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-black text-white border-b border-yellow-400/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 sm:h-28 lg:h-32">
          {/* Logo Section - Mobile Optimized */}
          <Link href="/" className="flex items-center gap-4 sm:gap-5 lg:gap-6">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 shrink-0">
              <Image
                src="/logo.png"
                alt="FireShop Logo"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg sm:text-xl lg:text-2xl tracking-wide text-white uppercase" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                GANISHKHASRI
              </span>
              <span className="text-sm sm:text-base text-yellow-400 uppercase hidden sm:inline">
                CRACKERS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <Link 
              href="/" 
              className="text-white hover:text-yellow-400 transition-colors font-medium cursor-pointer flex items-center gap-2"
              onClick={() => {
                // Reset Best Sellers filter when going to Home
                if (showBestSellersOnly) {
                  setShowBestSellersOnly(false);
                }
              }}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white hover:text-yellow-300 transition-all duration-300 font-medium cursor-pointer flex items-center gap-2 hover:scale-105">
                <Menu className="h-4 w-4" />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-semibold">Categories</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-96 bg-gradient-to-br from-gray-900 to-black text-white border-yellow-400/50 shadow-2xl">
                <div className="grid grid-cols-3 gap-2 p-3">
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-yellow-500/20 focus:to-orange-500/20 focus:text-yellow-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-yellow-400/30" onClick={() => window.location.href = '/#category-sparklers'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Sparklers
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-orange-500/20 focus:to-yellow-500/20 focus:text-orange-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-orange-400/30" onClick={() => window.location.href = '/#category-flower-pots'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Flower Pots
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-red-500/20 focus:to-orange-500/20 focus:text-red-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-red-400/30" onClick={() => window.location.href = '/#category-flower-pot-bombs'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Flower Pot Bombs
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-orange-500/20 focus:to-yellow-500/20 focus:text-orange-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-orange-400/30" onClick={() => window.location.href = '/#category-chakra'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Chakra
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-emerald-500/20 focus:to-teal-500/20 focus:text-emerald-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-emerald-400/30" onClick={() => window.location.href = '/#category-peacocks'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      Peacocks
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-yellow-500/20 focus:to-amber-500/20 focus:text-yellow-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-yellow-400/30" onClick={() => window.location.href = '/#category-pencil'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Pencil
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-amber-500/20 focus:to-yellow-500/20 focus:text-amber-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-amber-400/30" onClick={() => window.location.href = '/#category-bijili'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      Bijili
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-purple-500/20 focus:to-indigo-500/20 focus:text-purple-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-purple-400/30" onClick={() => window.location.href = '/#category-special-celebration-function'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Special Celebration Function
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-cyan-500/20 focus:to-blue-500/20 focus:text-cyan-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-cyan-400/30" onClick={() => window.location.href = '/#category-twinkling-star'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      Twinkling Star
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-purple-500/20 focus:to-indigo-500/20 focus:text-purple-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-purple-400/30" onClick={() => window.location.href = '/#category-bombs'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Bombs
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-orange-500/20 focus:to-yellow-500/20 focus:text-orange-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-orange-400/30" onClick={() => window.location.href = '/#category-sound-crackers'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Sound Crackers
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-cyan-500/20 focus:to-blue-500/20 focus:text-cyan-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-cyan-400/30" onClick={() => window.location.href = '/#category-rockets'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      Rockets
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-indigo-500/20 focus:to-purple-500/20 focus:text-indigo-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-indigo-400/30" onClick={() => window.location.href = '/#category-aerial-shot'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      Aerial Shot
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-teal-500/20 focus:to-cyan-500/20 focus:text-teal-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-teal-400/30" onClick={() => window.location.href = '/#category-tin-series'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                      TIN Series
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-cyan-500/20 focus:to-teal-500/20 focus:text-cyan-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-cyan-400/30" onClick={() => window.location.href = '/#category-whistling-fountain'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      Whistling Fountain
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-pink-500/20 focus:to-rose-500/20 focus:text-pink-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-pink-400/30" onClick={() => window.location.href = '/#category-crackling-fountain'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      Crackling Fountain
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-green-500/20 focus:to-emerald-500/20 focus:text-green-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-green-400/30" onClick={() => window.location.href = '/#category-digital-wala'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Digital Wala
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-green-500/20 focus:to-emerald-500/20 focus:text-green-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-green-400/30" onClick={() => window.location.href = '/#category-children-novelty'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Children Novelty
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gradient-to-r focus:from-amber-500/20 focus:to-orange-500/20 focus:text-amber-300 cursor-pointer text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-amber-400/30" onClick={() => window.location.href = '/#category-gift-boxes'}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      Gift Boxes
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Best Sellers */}
            <button 
              onClick={() => {
                setShowBestSellersOnly?.(!showBestSellersOnly);
              }}
              className={`text-white hover:text-yellow-400 transition-colors font-medium cursor-pointer flex items-center gap-2 ${
                showBestSellersOnly ? 'text-yellow-400' : ''
              }`}
            >
              <Flame className="h-4 w-4" />
              {showBestSellersOnly ? 'All Products' : 'Best Sellers'}
            </button>
            
            {/* Cart */}
            <Link href="/checkout" className="text-white hover:text-yellow-400 transition-colors font-medium cursor-pointer flex items-center gap-2 relative">
              <ShoppingCart className="h-4 w-4" />
              Cart
              {hasCartItems && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {items.length}
                </span>
              )}
            </Link>
            
            {user && isAdmin && (
              <Link href="/inventory" className="text-white hover:text-yellow-400 transition-colors font-medium cursor-pointer">
                Inventory
              </Link>
            )}
            <Link href="/orders" className="text-white hover:text-yellow-400 transition-colors font-medium cursor-pointer">
              Orders
            </Link>
            <Link href="/contact" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Contact Us
            </Link>


            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback className="bg-yellow-400 text-black font-bold">
                      {user.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black text-white border-gray-800">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-white cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="focus:bg-gray-800 focus:text-white cursor-pointer text-red-500 focus:text-red-500"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginModal>
                <button className="bg-yellow-400 text-black px-3 py-1 sm:px-5 sm:py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors cursor-pointer text-sm sm:text-base">
                  Login / Signup
                </button>
              </LoginModal>
            )}
          </div>

          {/* Mobile Menu Button - Optimized */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none cursor-pointer p-1">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Optimized */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="flex flex-col px-4 py-3 sm:py-4 space-y-2 sm:space-y-4">
            <Link 
              href="/" 
              className="text-white hover:text-yellow-400 font-medium cursor-pointer flex items-center gap-2 py-1" 
              onClick={() => {
                // Reset Best Sellers filter when going to Home
                if (showBestSellersOnly) {
                  setShowBestSellersOnly(false);
                }
                setIsOpen(false);
              }}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            
            {/* Categories - Mobile */}
            <div className="flex flex-col gap-1">
              <span className="text-yellow-400 font-medium text-sm">Categories:</span>
              <div className="grid grid-cols-2 gap-1">
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#sparklers'; setIsOpen(false); }}>Sparklers</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#flowerpots'; setIsOpen(false); }}>Flower Pots</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#groundchakkar'; setIsOpen(false); }}>Ground Chakkar</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#peacocks'; setIsOpen(false); }}>Peacocks</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#bijili'; setIsOpen(false); }}>Bijili Crackers</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#twinklingstar'; setIsOpen(false); }}>Twinkling Star</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#pencil'; setIsOpen(false); }}>Pencil Shots</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#bombs'; setIsOpen(false); }}>Bombs</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#saravadi'; setIsOpen(false); }}>Sound Crackers</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#rockets'; setIsOpen(false); }}>Rockets</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#aerialshot'; setIsOpen(false); }}>Aerial Shot</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#whistlingfountain'; setIsOpen(false); }}>Whistling Fountain</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#cracklingfountain'; setIsOpen(false); }}>Crackling Fountain</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#digitalwala'; setIsOpen(false); }}>Digital Wala</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => {
                    const element = document.getElementById('category-childrennovelty');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      // Fallback to URL change
                      window.location.href = '/#childrennovelty';
                    }
                    setIsOpen(false);
                  }}>Children Novelty</button>
                <button className="text-white hover:text-yellow-400 text-xs py-1 text-left" onClick={() => { window.location.href = '/#giftbox'; setIsOpen(false); }}>Gift Boxes</button>
              </div>
            </div>
            
            {/* Best Sellers - Mobile */}
            <button 
              onClick={() => {
                setShowBestSellersOnly?.(!showBestSellersOnly);
                setIsOpen(false);
              }}
              className={`text-white hover:text-yellow-400 font-medium cursor-pointer flex items-center gap-2 py-1 ${
                showBestSellersOnly ? 'text-yellow-400' : ''
              }`}
            >
              <Flame className="h-4 w-4" />
              {showBestSellersOnly ? 'All Products' : 'Best Sellers'}
            </button>
            
            {/* Cart - Mobile */}
            <Link href="/checkout" className="text-white hover:text-yellow-400 font-medium cursor-pointer flex items-center gap-2 py-1 relative" onClick={() => setIsOpen(false)}>
              <ShoppingCart className="h-4 w-4" />
              Cart
              {hasCartItems && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {items.length}
                </span>
              )}
            </Link>
            
            {user && isAdmin && (
              <Link href="/inventory" className="text-white hover:text-yellow-400 font-medium cursor-pointer py-1" onClick={() => setIsOpen(false)}>
                Inventory
              </Link>
            )}
            <Link href="/orders" className="text-white hover:text-yellow-400 font-medium cursor-pointer py-1" onClick={() => setIsOpen(false)}>
              Orders
            </Link>
            <Link href="/contact" className="text-white hover:text-yellow-400 font-medium py-1" onClick={() => setIsOpen(false)}>
              Contact Us
            </Link>

            {user ? (
              <div className="flex flex-col gap-2 border-t border-gray-800 pt-2">
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback className="bg-yellow-400 text-black text-xs">
                      {user.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.displayName}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-red-500 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            ) : (
              <LoginModal>
                <button className="text-primary font-bold w-full text-left cursor-pointer" onClick={() => setIsOpen(false)}>
                  Login / Signup
                </button>
              </LoginModal>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
