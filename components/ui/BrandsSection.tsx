'use client'

import { Award, Phone, Mail } from 'lucide-react'

const brands = [
    'Winstar',
    'Sky King',
    'Annai',
    'Vadivel',
    'Hayagrivar',
    'Vanitha',
    'Sri Vijay',
    'Dass',
    'Varshini',
    'Nayagi',
    'Deepam',
    'Sri Krishna',
    "Mother's",
    'Suryakala'
]

export function BrandsSection() {
    return (
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Brands Section */}
                    <div>
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Award className="w-6 h-6 text-amber-400" />
                            <h3 className="text-2xl font-bold text-amber-400">Trusted Brands</h3>
                            <Award className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-slate-200">
                            {brands.map((brand, index) => (
                                <span key={brand} className="font-semibold hover:text-amber-400 transition-colors cursor-default">
                                    {brand}
                                    {index < brands.length - 1 && <span className="mx-3 text-amber-400">•</span>}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contact Us Section */}
                    <div className="border-t md:border-t-0 md:border-l border-slate-700 pt-8 md:pt-0 md:pl-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <h3 className="text-xl font-semibold text-amber-400">Contact Us</h3>
                        </div>
                        <div className="flex flex-col gap-4 text-sm md:text-base text-slate-300">
                            <a href="https://wa.me/918248817401" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 hover:text-amber-400 transition-colors cursor-pointer font-medium">
                                <Phone className="w-5 h-5" />
                                <span className="text-lg">+91 8248817401</span>
                            </a>
                            <a href="tel:+918248817402" className="flex items-center justify-center gap-2 hover:text-amber-400 transition-colors cursor-pointer font-medium">
                                <Phone className="w-5 h-5" />
                                <span className="text-lg">+91 8248817402</span>
                            </a>
                            <a href="mailto:info@fireshop.com" className="flex items-center justify-center gap-2 hover:text-amber-400 transition-colors cursor-pointer font-medium">
                                <Mail className="w-5 h-5" />
                                <span className="text-lg">info@fireshop.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
