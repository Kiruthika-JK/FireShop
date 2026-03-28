"use client";

import { useState, useEffect } from 'react';
import { ClickSparkle } from './ClickSparkle';

interface SparkleEvent {
  id: number;
  x: number;
  y: number;
}

export function SparkleContainer() {
  const [sparkles, setSparkles] = useState<SparkleEvent[]>([]);

  const addSparkle = (x: number, y: number) => {
    const id = Date.now() + Math.random();
    setSparkles(prev => [...prev, { id, x, y }]);
  };

  const removeSparkle = (id: number) => {
    setSparkles(prev => prev.filter(s => s.id !== id));
  };

  // Expose method globally
  useEffect(() => {
    (window as any).addClickSparkle = addSparkle;
    return () => {
      delete (window as any).addClickSparkle;
    };
  }, []);

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
