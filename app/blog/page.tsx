import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/data/blog'
import { generateSEOHead } from '@/components/seo/SEOHead'

const siteUrl = 'https://www.ganishkhasricrackers.in'

export const metadata: Metadata = generateSEOHead({
    title: 'Crackers Blog | Sivakasi Crackers, Diwali 2026 & Pattasu Online Tips',
    description: 'Read the Ganishkha Sri Crackers blog for Sivakasi crackers buying guides, Diwali 2026 tips, pattasu online safety, wholesale price lists and kids-friendly crackers.',
    canonical: `${siteUrl}/blog`,
    keywords: 'crackers blog, sivakasi crackers blog, diwali 2026 blog, pattasu online tips, buy crackers online guide, wholesale crackers, firework safety, ganishkha sri crackers',
})

export default function BlogPage() {
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
        ],
    }

    const blogJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Ganishkha Sri Crackers Blog',
        url: `${siteUrl}/blog`,
        description: 'Crackers buying guides, Diwali tips and pattasu online advice.',
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />

            <section className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-4">
                        Crackers Blog
                    </h1>
                    <p className="text-lg sm:text-xl text-yellow-400 mb-2">
                        Sivakasi Crackers • Diwali 2026 • Pattasu Online Tips
                    </p>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Buying guides, safety tips, price lists and celebration ideas for online crackers shoppers.
                    </p>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogPosts.map((post) => (
                            <article
                                key={post.slug}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <p className="text-xs text-gray-500 mb-2">{post.date}</p>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                                        <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                                            {post.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-block text-primary font-semibold text-sm hover:underline"
                                    >
                                        Read more →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
