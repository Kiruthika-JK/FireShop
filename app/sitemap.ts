import { MetadataRoute } from 'next'
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs'

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
      url: `${baseUrl}/diwali-crackers-online`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  try {
    const products = await FirestoreProductsDs.getProducts()
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...base, ...productUrls]
  } catch (error) {
    console.error('Failed to generate product sitemap entries:', error)
    return base
  }
}
