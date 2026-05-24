import React from 'react';
import { Button } from './button';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  glow?: boolean;
}

export function AnimatedButton({ 
  children, 
  className = '', 
  glow = false,
  ...props 
}: AnimatedButtonProps) {
  return (
    <div className="relative inline-block">
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 rounded-lg blur-md opacity-75 animate-pulse" />
      )}
      <Button
        className={`
          relative transform transition-all duration-200 hover:scale-105 active:scale-95
          ${glow ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 border-0' : ''}
          ${className}
        `}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Button>
    </div>
  );
}
