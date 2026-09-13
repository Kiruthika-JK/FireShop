'use client';

import { MapPin, Users as UsersIcon } from 'lucide-react';

const deliveryStates = [
    'Jammu & Kashmir',
    'West Bengal',
    'Karnataka',
    'Kerala',
    'Tamil Nadu',
    'Andhra Pradesh',
    'Telangana',
    'Maharashtra',
    'Uttar Pradesh',
    'Uttarakhand',
];

export function DeliveryStates() {
    return (
        <section className="bg-gradient-to-br from-slate-900 to-black py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold mb-3">
                        <UsersIcon className="w-4 h-4" />
            Our Customer Base
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Customers From Across India
                    </h2>
                    <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Proudly serving cracker lovers from these states. Join our growing family of happy customers this Diwali.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {deliveryStates.map((state) => (
                        <div
                            key={state}
                            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-white hover:bg-white/20 transition-colors"
                        >
                            <MapPin className="w-4 h-4 text-yellow-400 shrink-0" />
                            <span className="text-sm font-medium">{state}</span>
                        </div>
                    ))}
                </div>

                <p className="text-center text-gray-400 text-sm mt-6">
          We deliver to your state too. Call or WhatsApp 82488 17401 / 81481 65318 to place your order.
                </p>
            </div>
        </section>
    );
}
