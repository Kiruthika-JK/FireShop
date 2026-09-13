import { MetadataRoute } from 'next'
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs'
import { getProductUrl } from '@/lib/features/product/utils/productUrl'
import { categories } from '@/lib/data/categories'
import { blogPosts } from '@/lib/data/blog'

export const revalidate = 86400

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.ganishkhasricrackers.in'

    const base = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/sivakasi-crackers`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/diwali-crackers-online`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
    ]

    const categoryUrls = categories.map((c) => ({
        url: `${baseUrl}/category/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const blogUrls = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    try {
        const products = await FirestoreProductsDs.getProducts()
        const productUrls = products.map((product) => ({
            url: `${baseUrl}${getProductUrl(product)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        return [...base, ...categoryUrls, ...productUrls, ...blogUrls]
    } catch (error) {
        console.error('Failed to generate product sitemap entries:', error)
        return [...base, ...categoryUrls, ...blogUrls]
    }
}
