export interface ProductModel {
    id: string;
    name: string;
    content: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number; // integer (0-100)
    outOfStock?: boolean;
    thumbnail?: string;
    previews?: string[];
    category: string;
    categoryPosition: number;
    productPosition: number;
    trending?: boolean;
    // SEO Optimization Fields
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    structuredData?: any;
    // YouTube Video Fields
    youtubeVideoId?: string;
    videoThumbnail?: string;
    videoTitle?: string;
    videoDescription?: string;
}
