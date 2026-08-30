'use client';

import { useEffect, useRef } from 'react';

export function AnnouncementBar() {
  const items = [
    'Tamil Nadu / Pondicherry: Min order ₹3000, No GST, delivery paid to courier',
    'Other States: Min order ₹6000, Flat 18% GST, delivery paid with order',
    'Need help? WhatsApp +91 8248817401'
  ];

  // Duplicate items enough times so the track always fills the viewport.
  const repeated = Array.from({ length: 6 }, (_, i) =>
    items.map((text, j) => `${i}-${j}`)
  ).flat();

  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let last = performance.now();
    const speed = 70; // px per second

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      xRef.current -= speed * dt;

      const first = track.firstElementChild as HTMLElement | null;
      if (first) {
        const style = window.getComputedStyle(first);
        const margin =
          (parseFloat(style.marginLeft) || 0) +
          (parseFloat(style.marginRight) || 0);
        const w = first.offsetWidth + margin;
        if (xRef.current + w <= 0) {
          track.appendChild(first);
          xRef.current += w;
        }
      }

      track.style.transform = `translateX(${xRef.current}px)`;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="bg-amber-100 text-amber-900 py-2 overflow-hidden border-b border-amber-200">
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ transform: 'translateX(0px)' }}
      >
        {repeated.map((key, index) => (
          <span
            key={key}
            className="mx-4 text-sm font-medium flex-none whitespace-nowrap"
          >
            {items[index % items.length]}
            <span className="mx-3 opacity-60">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
