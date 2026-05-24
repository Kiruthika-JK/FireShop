"use client";

import { useEffect, useRef, useState } from 'react';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

interface ClickSparkleProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export function ClickSparkle({ x, y, onComplete }: ClickSparkleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  const particlesRef = useRef<SparkleParticle[]>([]);

  useEffect(() => {
    const colors = [
      'radial-gradient(circle, rgba(255,215,0,1) 0%, rgba(255,215,0,0.6) 40%, rgba(255,215,0,0) 70%)',
      'radial-gradient(circle, rgba(255,105,180,1) 0%, rgba(255,105,180,0.6) 40%, rgba(255,105,180,0) 70%)',
      'radial-gradient(circle, rgba(255,69,0,1) 0%, rgba(255,69,0,0.6) 40%, rgba(255,69,0,0) 70%)',
      'radial-gradient(circle, rgba(255,165,0,1) 0%, rgba(255,165,0,0.6) 40%, rgba(255,165,0,0) 70%)',
      'radial-gradient(circle, rgba(255,99,71,1) 0%, rgba(255,99,71,0.6) 40%, rgba(255,99,71,0) 70%)',
      'radial-gradient(circle, rgba(255,255,0,1) 0%, rgba(255,255,0,0.6) 40%, rgba(255,255,0,0) 70%)'
    ];
    
    const newParticles: SparkleParticle[] = [];
    
    // Create explosion of particles
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const velocity = Math.random() * 2 + 1; // Slower velocity
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 1.5, // Less upward bias
        size: Math.random() * 6 + 3, // Larger particles
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }
    
    particlesRef.current = newParticles;
    setParticles([...newParticles]);

    const animate = () => {
      const updated = particlesRef.current.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.1, // Less gravity for slower fall
        life: p.life - 0.008, // Slower fade out (was 0.02)
      })).filter(p => p.life > 0);
      
      particlesRef.current = updated;
      setParticles([...updated]);
      
      if (updated.length === 0) {
        onComplete();
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [x, y, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size * 2}px`, // Double size for glow effect
            height: `${particle.size * 2}px`,
            background: particle.color,
            opacity: particle.life,
            transform: 'translate(-50%, -50%)',
            filter: `blur(${particle.size * 0.3}px)`, // Add blur for glow
            boxShadow: `0 0 ${particle.size * 4}px ${particle.color.split(',')[0]}, 0 0 ${particle.size * 8}px ${particle.color.split(',')[0]}`,
          }}
        />
      ))}
    </div>
  );
}
