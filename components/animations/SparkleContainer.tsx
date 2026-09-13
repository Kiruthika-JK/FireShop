"use client";

import { useState, useEffect, useCallback } from 'react';
import { ClickSparkle } from './ClickSparkle';

declare global {
    interface Window {
        addClickSparkle?: (x: number, y: number) => void;
    }
}

interface SparkleEvent {
  id: number;
  x: number;
  y: number;
}

export function SparkleContainer() {
    const [sparkles, setSparkles] = useState<SparkleEvent[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true);
    }, []);

    const addSparkle = useCallback((x: number, y: number) => {
        const id = Date.now() + Math.random();
        setSparkles(prev => [...prev, { id, x, y }]);
    }, []);

    const removeSparkle = useCallback((id: number) => {
        setSparkles(prev => prev.filter(s => s.id !== id));
    }, []);

    // Expose method globally
    useEffect(() => {
        if (!isClient) return;

        window.addClickSparkle = addSparkle;
        return () => {
            delete window.addClickSparkle;
        };
    }, [isClient, addSparkle]);

    if (!isClient) {
        return null;
    }

    return (
        <>
            {sparkles.map(sparkle => (
                <ClickSparkle
                    key={sparkle.id}
                    x={sparkle.x}
                    y={sparkle.y}
                    onComplete={() => removeSparkle(sparkle.id)}
                />
            ))}
        </>
    );
}
