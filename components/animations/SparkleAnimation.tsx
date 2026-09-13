"use client";

import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  left: number;
  top: number;
  size: number;
  animationDuration: number;
}

function generateSparkles(): Sparkle[] {
    const newSparkles: Sparkle[] = [];
    for (let i = 0; i < 15; i++) {
        newSparkles.push({
            id: Math.random(),
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 3 + 1,
            animationDuration: Math.random() * 2 + 1,
        });
    }
    return newSparkles;
}

export function SparkleAnimation() {
    const [sparkles, setSparkles] = useState<Sparkle[]>(() => generateSparkles());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const interval = setInterval(() => {
            setSparkles(generateSparkles());
        }, 3000);

        return () => clearInterval(interval);
    }, [isClient]);

    if (!isClient) {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {sparkles.map((sparkle) => (
                <div
                    key={sparkle.id}
                    className="absolute animate-pulse"
                    style={{
                        left: `${sparkle.left}%`,
                        top: `${sparkle.top}%`,
                        width: `${sparkle.size}px`,
                        height: `${sparkle.size}px`,
                        animationDuration: `${sparkle.animationDuration}s`,
                    }}
                >
                    <div className="w-full h-full bg-yellow-300 rounded-full opacity-60 animate-ping" />
                </div>
            ))}
        </div>
    );
}
