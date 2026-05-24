"use client";

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export function FireworksAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const colors = ['#ff0000', '#ffd700', '#ff69b4', '#00ff00', '#ff4500', '#1e90ff'];

    class Firework {
      x: number;
      y: number;
      targetY: number;
      vx: number;
      vy: number;
      color: string;
      exploded: boolean = false;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = canvasHeight;
        this.targetY = Math.random() * canvasHeight * 0.5;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 3 - 12;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        if (!this.exploded) {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += 0.3;

          if (this.vy >= 0 || this.y <= this.targetY) {
            this.explode();
          }
        }
      }

      explode() {
        this.exploded = true;
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount;
          const velocity = Math.random() * 5 + 2;
          particles.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            radius: Math.random() * 2 + 1,
            color: this.color,
            alpha: 1,
            decay: Math.random() * 0.015 + 0.005
          });
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (!this.exploded) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }
    }

    const fireworks: Firework[] = [];

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Launch new firework randomly
      if (Math.random() < 0.03) {
        fireworks.push(new Firework(canvas.width, canvas.height));
      }

      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw(ctx);
        if (fireworks[i].exploded) {
          fireworks.splice(i, 1);
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
}
