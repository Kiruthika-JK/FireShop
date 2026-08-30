'use client';

export function AnnouncementBar() {
  const items = [
    'Tamil Nadu / Pondicherry: Min order ₹3000, No GST, delivery paid to courier',
    'Other States: Min order ₹6000, Flat 18% GST, delivery paid with order',
    'Need help? WhatsApp +91 8248817401'
  ];
  // Repeat enough times so one copy is always wider than the viewport; this removes the visible snap.
  const text = Array.from({ length: 6 }, () => items).flat().join('   •   ');

  return (
    <div className="bg-amber-100 text-amber-900 py-2 overflow-hidden border-b border-amber-200">
      <div className="flex whitespace-nowrap animate-marquee will-change-transform">
        <span className="mx-6 text-sm font-medium">{text}</span>
        <span className="mx-6 text-sm font-medium">{text}</span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        @media (hover: hover) {
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
}
