'use client'

import Link from 'next/link'
import { blogPosts } from '@/lib/data/blog'

export function LatestBlog() {
    const posts = blogPosts.slice(0, 3)

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
            <div className="container mx-auto max-w-6xl">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Crackers Buying Guides</h2>
                <p className="text-gray-600 text-center mb-8">
                    Learn how to buy Sivakasi crackers online, Diwali safety tips and wholesale price guides.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <article
                            key={post.slug}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <p className="text-xs text-gray-500 mb-2">{post.date}</p>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-700 text-sm line-clamp-3">{post.excerpt}</p>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link
                        href="/blog"
                        className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        View all guides
                    </Link>
                </div>
            </div>
        </section>
    )
}
