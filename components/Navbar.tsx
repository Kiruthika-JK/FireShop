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
import { LogOut, User as UserIcon, Home } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const { items } = useCartStore();
  const hasCartItems = items.length > 0;

  // Hide Navbar on Product Preview page
  if (pathname?.includes("/preview")) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-black text-white border-b border-yellow-400/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Section - Mobile Optimized */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
              <Image
                src="/logo.png"
                alt="FireShop Logo"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm sm:text-lg md:text-2xl tracking-wide text-white uppercase" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                GANISHKHASRI
              </span>
              <span className="text-xs sm:text-sm text-yellow-400 uppercase hidden sm:inline">
                CRACKERS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 sm:gap-8">
            <Link href="/" className="text-white hover:text-yellow-400 transition-colors font-medium cursor-pointer flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
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
            <Link href="/" className="text-white hover:text-yellow-400 font-medium cursor-pointer flex items-center gap-2 py-1" onClick={() => setIsOpen(false)}>
              <Home className="h-4 w-4" />
              Home
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
