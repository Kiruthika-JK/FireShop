"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
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
import { LogOut, User as UserIcon } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Hide Navbar on Product Preview page
  if (pathname?.includes("/preview")) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-black text-white border-b border-primary/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3">
            {/* Placeholder for "TS" logo if image not available, using a styled circle */}
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-lg shrink-0">
              <span className="font-bold italic text-white text-lg">TS</span>
            </div>

            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg md:text-2xl tracking-wide text-white uppercase" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                GANISHKHASRI CRACKERS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/orders" className="text-white hover:text-primary transition-colors font-medium cursor-pointer">
              Orders
            </Link>
            <Link href="#" className="text-white hover:text-primary transition-colors font-medium">
              Refer
            </Link>
            <Link href="/contact" className="text-white hover:text-primary transition-colors font-medium">
              Contact Us
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback className="bg-primary text-black font-bold">
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
                <button className="bg-primary text-black px-5 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors cursor-pointer">
                  Login / Signup
                </button>
              </LoginModal>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none cursor-pointer">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="flex flex-col px-4 py-4 space-y-4">
            <Link href="/orders" className="text-white hover:text-primary font-medium cursor-pointer" onClick={() => setIsOpen(false)}>
              Orders
            </Link>
            <Link href="#" className="text-white hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
              Refer
            </Link>
            <Link href="/contact" className="text-white hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
              Contact Us
            </Link>
            {user ? (
              <div className="flex flex-col gap-2 border-t border-gray-800 pt-2">
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback className="bg-primary text-black text-xs">
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
