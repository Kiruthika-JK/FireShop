export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-4xl font-serif font-bold text-center mb-12 text-primary">Contact Us</h1>

                <div className="bg-[#111] border border-primary/20 rounded-xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="space-y-8 relative z-10">

                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mb-2 text-white">Nagalakshmi Saravanakarthikeyan</h2>
                            <p className="text-gray-400">Proprietor</p>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-300 mb-1">Phone Numbers</h3>
                                    <div className="flex flex-col gap-1">
                                        <a href="tel:8248817401" className="text-xl font-bold text-white hover:text-primary transition-colors">82488 17401</a>
                                        <a href="tel:8148165318" className="text-xl font-bold text-white hover:text-primary transition-colors">81481 65318</a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-300 mb-1">Address</h3>
                                    <p className="text-lg text-white leading-relaxed">
                                        Chinnakamanpatti,<br />
                                        Sivakasi - 626189.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}
