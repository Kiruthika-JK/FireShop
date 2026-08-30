'use client';

export function AnnouncementBar() {
  const items = [
    'Tamil Nadu / Pondicherry: Min order ₹3000, No GST, delivery paid to courier',
    'Other States: Min order ₹6000, Flat 18% GST, delivery paid with order',
    'Need help? WhatsApp +91 8248817401'
  ];
  const text = items.join('   •   ');

  return (
    <div className="bg-amber-100 text-amber-900 py-2 overflow-hidden border-b border-amber-200">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="mx-6 text-sm font-medium">{text}</span>
        <span className="mx-6 text-sm font-medium">{text}</span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
