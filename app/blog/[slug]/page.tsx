import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts, getBlogPostBySlug } from '@/lib/data/blog'
import { generateSEOHead } from '@/components/seo/SEOHead'

const siteUrl = 'https://www.ganishkhasricrackers.in'

export const revalidate = 86400

export function generateStaticParams() {
    return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const post = getBlogPostBySlug(slug)

    if (!post) {
        return { title: 'Blog Post Not Found | Ganishkha Sri Crackers' }
    }

    return generateSEOHead({
        title: `${post.title} | Ganishkha Sri Crackers Blog`,
        description: post.excerpt,
        canonical: `${siteUrl}/blog/${post.slug}`,
        keywords: post.keywords.join(', '),
    })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getBlogPostBySlug(slug)

    if (!post) {
        notFound()
    }

    const relatedPosts = blogPosts
        .filter((p) => post.relatedSlugs.includes(p.slug))
        .slice(0, 3)

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        url: `${siteUrl}/blog/${post.slug}`,
        datePublished: post.date,
        dateModified: post.date,
        author: {
            '@type': 'Organization',
            name: post.author,
            url: siteUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Ganishkha Sri Crackers',
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png?v=2`,
            },
        },
        image: post.image ? `${siteUrl}${post.image}` : `${siteUrl}/logo.png?v=2`,
        keywords: post.keywords.join(', '),
    }

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
        ],
    }

    const faqJsonLd = post.faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
            },
        })),
    } : null

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

            <section className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl">
                    <Link href="/blog" className="text-yellow-400 hover:underline text-sm mb-4 inline-block">
                        ← Back to Blog
                    </Link>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-4">
                        {post.title}
                    </h1>
                    <p className="text-gray-300 text-sm">
                        {post.date} • {post.author}
                    </p>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-3xl">
                    <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10 mb-10">
                        <p className="text-lg text-gray-700 font-medium mb-6">{post.excerpt}</p>
                        <div
                            className="prose prose-slate max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {post.faqs.length > 0 && (
                            <div className="mt-10 pt-8 border-t border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    {post.faqs.map((faq, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                            <p className="text-gray-700 text-sm">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-4">Tags: {post.keywords.join(', ')}</p>
                            <Link
                                href="/blog"
                                className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Read more articles
                            </Link>
                        </div>
                    </article>

                    {relatedPosts.length > 0 && (
                        <aside className="bg-gray-100 rounded-xl p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Guides</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {relatedPosts.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={`/blog/${related.slug}`}
                                        className="block bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <p className="text-xs text-gray-500 mb-1">{related.date}</p>
                                        <h3 className="font-semibold text-gray-900 text-sm">{related.title}</h3>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    )}
                </div>
            </section>
        </main>
    )
}
