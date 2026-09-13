'use client'

import Link from 'next/link'
import { categories } from '@/lib/data/categories'

export function PopularCategories() {
    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="container mx-auto max-w-6xl">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Popular Crackers Categories</h2>
                <p className="text-gray-600 text-center mb-8">
                    Browse Sivakasi crackers by category and order online at factory prices.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="group flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all text-center"
                        >
                            <span className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
