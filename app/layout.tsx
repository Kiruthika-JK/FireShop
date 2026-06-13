import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth-context";
import { BestSellersProvider } from "@/lib/best-sellers-context";
import { SparkleAnimation } from "@/components/animations/SparkleAnimation";
import { SparkleContainer } from "@/components/animations/SparkleContainer";
import { generateSEOHead } from "@/components/seo/SEOHead";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...generateSEOHead({}),
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        suppressHydrationWarning
      >
        <SparkleAnimation />
        <SparkleContainer />
        <AuthProvider>
          <BestSellersProvider>
            <Navbar />
            {children}
          </BestSellersProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
