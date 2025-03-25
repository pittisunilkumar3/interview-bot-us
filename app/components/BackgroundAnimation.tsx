'use client';

import React, { useState, useEffect } from 'react';

interface BackgroundAnimationProps {
  variant?: 'default' | 'active' | 'subtle';
}

export default function BackgroundAnimation({ variant = 'default' }: BackgroundAnimationProps) {
  // Use state to ensure consistent rendering between server and client
  const [mounted, setMounted] = useState(false);
  
  // Only render particles on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {/* Base white background with warm gradient overlay */}
      <div 
        className={`
          absolute inset-0 transition-opacity duration-1000
          ${variant === 'active' ? 'opacity-60' : 'opacity-40'}
          ${variant === 'subtle' ? 'opacity-25' : ''}
        `}
      >
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--accent-cream))] via-white to-[rgb(var(--accent-sand))] opacity-30 animate-gradient-flow" />
      </div>

      {/* Ambient glow orbs with soft, warm colors */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Top right glow */}
          <div 
            className={`
              absolute -top-40 -right-40 w-[500px] h-[500px] 
              bg-[rgb(var(--accent-highlight))] rounded-full blur-[120px]
              animate-pulse opacity-20
              ${variant === 'active' ? 'opacity-30' : ''}
              ${variant === 'subtle' ? 'opacity-15' : ''}
            `}
            style={{ animationDuration: '20s' }}
          />

          {/* Bottom left glow */}
          <div 
            className={`
              absolute -bottom-40 -left-40 w-[500px] h-[500px]
              bg-[rgb(var(--accent-sand))] rounded-full blur-[120px]
              animate-pulse opacity-20
              ${variant === 'active' ? 'opacity-30' : ''}
              ${variant === 'subtle' ? 'opacity-15' : ''}
            `}
            style={{ animationDuration: '25s', animationDelay: '2s' }}
          />
          
          {/* Center accent glow */}
          <div 
            className={`
              absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 
              w-[300px] h-[300px]
              bg-[rgb(var(--primary-gold))] rounded-full blur-[150px]
              animate-pulse opacity-10
              ${variant === 'active' ? 'opacity-15 w-[400px] h-[400px]' : ''}
              ${variant === 'subtle' ? 'opacity-5 w-[250px] h-[250px]' : ''}
            `}
            style={{ animationDuration: '30s', animationDelay: '1s' }}
          />
        </div>
      </div>

      {/* Subtle grid pattern */}
      <div 
        className={`
          absolute inset-0 opacity-[0.02]
          bg-[linear-gradient(0deg,transparent_24%,rgba(var(--neutral-300),0.3)_25%,rgba(var(--neutral-300),0.3)_26%,transparent_27%,transparent_74%,rgba(var(--neutral-300),0.3)_75%,rgba(var(--neutral-300),0.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(var(--neutral-300),0.3)_25%,rgba(var(--neutral-300),0.3)_26%,transparent_27%,transparent_74%,rgba(var(--neutral-300),0.3)_75%,rgba(var(--neutral-300),0.3)_76%,transparent_77%,transparent)]
          bg-[size:60px_60px]
          animate-grid-scroll
          ${variant === 'active' ? 'opacity-[0.03]' : ''}
          ${variant === 'subtle' ? 'opacity-[0.01]' : ''}
        `}
      />

      {/* Only render particles on client side to avoid hydration mismatch */}
      {mounted && (
        <div className="absolute inset-0">
          {/* Small golden particles */}
          {[...Array(15)].map((_, i) => {
            // Generate static values for styles to prevent hydration mismatch
            const leftValue = `${(i * 6.5) % 100}%`;
            const topValue = `${(i * 7 + 3) % 100}%`;
            const animationDuration = `${8 + (i % 7)}s`;
            
            return (
              <div
                key={`small-${i}`}
                className="absolute w-1 h-1 rounded-full bg-[rgba(var(--primary-gold),0.3)] animate-float-particle"
                style={{
                  left: leftValue,
                  top: topValue,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: animationDuration
                }}
              />
            );
          })}
          
          {/* Medium blue particles */}
          {[...Array(10)].map((_, i) => {
            // Generate static values for styles to prevent hydration mismatch
            const leftValue = `${(i * 10) % 100}%`;
            const topValue = `${(i * 9 + 5) % 100}%`;
            const animationDuration = `${10 + (i % 5)}s`;
            
            return (
              <div
                key={`medium-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-[rgba(var(--primary-blue),0.2)] animate-float-particle"
                style={{
                  left: leftValue,
                  top: topValue,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: animationDuration
                }}
              />
            );
          })}
          
          {/* Large sand particles */}
          {[...Array(5)].map((_, i) => {
            // Generate static values for styles to prevent hydration mismatch
            const leftValue = `${(i * 20) % 100}%`;
            const topValue = `${(i * 18 + 7) % 100}%`;
            const animationDuration = `${12 + (i % 7)}s`;
            
            return (
              <div
                key={`large-${i}`}
                className="absolute w-2 h-2 rounded-full bg-[rgba(var(--accent-sand),0.25)] animate-float-particle"
                style={{
                  left: leftValue,
                  top: topValue,
                  animationDelay: `${i * 1}s`,
                  animationDuration: animationDuration
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Very subtle vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_70%,rgba(0,0,0,0.03)_100%)]"></div>
    </div>
  );
}
