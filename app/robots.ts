import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/orders', '/inventory', '/product/*/preview', '/api/', '/admin/'],
    },
    sitemap: 'https://www.ganishkhasricrackers.in/sitemap.xml',
  }
}
