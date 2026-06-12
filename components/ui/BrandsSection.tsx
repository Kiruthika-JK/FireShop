'use client'

import { Award, Phone } from 'lucide-react'

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
                            <div className="text-center mb-2">
                                <h4 className="text-lg font-semibold text-white">Nagalakshmi Saravanakarthikeyan</h4>
                                <p className="text-slate-400 text-sm">Proprietor</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <a href="tel:8248817401" className="flex items-center justify-center gap-2 hover:text-amber-400 transition-colors cursor-pointer font-medium">
                                    <Phone className="w-5 h-5" />
                                    <span className="text-lg">82488 17401</span>
                                </a>
                                <a href="tel:8148165318" className="flex items-center justify-center gap-2 hover:text-amber-400 transition-colors cursor-pointer font-medium">
                                    <Phone className="w-5 h-5" />
                                    <span className="text-lg">81481 65318</span>
                                </a>
                            </div>
                            <div className="text-center pt-2">
                                <p className="text-slate-300 leading-relaxed">
                                    Chinnakamanpatti,<br />
                                    Sivakasi - 626189.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
