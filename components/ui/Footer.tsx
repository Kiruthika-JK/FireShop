import Link from 'next/link';
import { categories } from '@/lib/data/categories';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Ganishkha Sri Crackers</h3>
                        <p className="text-sm leading-relaxed">
              Premium Sivakasi crackers and Diwali fireworks at factory prices.
              Direct from Chinnakamanpatti, Sivakasi. Pan-India delivery.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-yellow-400 transition-colors">
                  Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/sivakasi-crackers" className="hover:text-yellow-400 transition-colors">
                  Sivakasi Crackers
                                </Link>
                            </li>
                            <li>
                                <Link href="/diwali-crackers-online" className="hover:text-yellow-400 transition-colors">
                  Diwali Crackers Online
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-yellow-400 transition-colors">
                  Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-yellow-400 transition-colors">
                  Blog
                                </Link>
                            </li>
                            <li>
                                <a href="/sitemap.xml" className="hover:text-yellow-400 transition-colors">
                  Sitemap
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                        <address className="not-italic text-sm space-y-2">
                            <p className="not-italic">Ganishkha Sri Traders</p>
                            <p className="not-italic">Chinnakamanpatti, Sattur Road</p>
                            <p className="not-italic">Sivakasi, Tamil Nadu - 626189</p>
                            <p className="not-italic">
                                <a href="tel:+918248817401" className="hover:text-yellow-400 transition-colors">
                  +91 82488 17401
                                </a>
                            </p>
                            <p className="not-italic">
                                <a href="tel:+918148165318" className="hover:text-yellow-400 transition-colors">
                  +91 81481 65318
                                </a>
                            </p>
                        </address>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Business Hours</h4>
                        <ul className="space-y-2 text-sm">
                            <li>All days: 9:00 AM - 9:00 PM</li>
                            <li>WhatsApp support available</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
                        <ul className="space-y-2 text-sm">
                            {categories.slice(0, 8).map((c) => (
                                <li key={c.slug}>
                                    <Link href={`/category/${c.slug}`} className="hover:text-yellow-400 transition-colors">
                                        {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm">
                    <p>
            &copy; {new Date().getFullYear()} Ganishkha Sri Crackers. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
