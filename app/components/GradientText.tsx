import React from 'react';

type GradientType = 'blue-gold' | 'gold-cream' | 'blue-sand' | 'gold-warmgray' | 'blue-cream' | 'blue-purple';
type AnimationType = 'none' | 'flow' | 'pulse' | 'shine';
type FontWeightType = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type SizeType = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl';

interface GradientTextProps {
  children: React.ReactNode;
  gradient?: GradientType;
  animation?: AnimationType;
  weight?: FontWeightType;
  size?: SizeType;
  className?: string;
  animate?: boolean;
  from?: string;
  via?: string;
  to?: string;
}

export default function GradientText({
  children,
  gradient = 'blue-gold',
  animation = 'none',
  weight = 'bold',
  size = '4xl',
  className = '',
  animate = false,
  from,
  via,
  to,
}: GradientTextProps) {
  // Gradient color maps
  const gradientMap: Record<GradientType, string> = {
    'blue-gold': 'from-[rgb(var(--primary-blue))] to-[rgb(var(--primary-gold))]',
    'gold-cream': 'from-[rgb(var(--primary-gold))] to-[rgb(var(--accent-cream))]',
    'blue-sand': 'from-[rgb(var(--primary-blue))] to-[rgb(var(--accent-sand))]',
    'gold-warmgray': 'from-[rgb(var(--primary-gold))] to-[rgb(var(--accent-warmgray))]',
    'blue-cream': 'from-[rgb(var(--primary-blue))] to-[rgb(var(--accent-cream))]',
    'blue-purple': 'from-[rgb(var(--primary-blue))] to-[rgb(var(--primary-purple))]',
  };

  // Font weight maps
  const weightMap: Record<FontWeightType, string> = {
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
    'bold': 'font-bold',
    'extrabold': 'font-extrabold',
  };

  // Size maps
  const sizeMap: Record<SizeType, string> = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
  };

  // Animation effects
  let animationClasses = '';
  
  if (animate || animation === 'flow') {
    animationClasses = 'animate-gradient-flow bg-[length:200%_auto]';
  } else {
    switch (animation) {
      case 'pulse':
        animationClasses = 'animate-pulse';
        break;
      case 'shine':
        animationClasses = 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-shine before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000';
        break;
      default:
        animationClasses = '';
    }
  }

  // Custom gradient or predefined one
  let gradientClasses = '';
  if (from || to) {
    gradientClasses = `${from || ''} ${via || ''} ${to || ''}`;
  } else {
    gradientClasses = gradientMap[gradient];
  }

  return (
    <span
      className={`
        text-transparent bg-clip-text bg-gradient-to-r ${gradientClasses} 
        ${weightMap[weight]} ${sizeMap[size]} ${animationClasses} ${className}
        tracking-tight
      `}
    >
      {children}
    </span>
  );
}

// Preset gradients
export const presets = {
  primary: {
    from: 'from-[rgb(var(--primary-blue))]',
    via: 'via-[rgb(var(--accent-warmgray))]',
    to: 'to-[rgb(var(--primary-gold))]'
  },
  success: {
    from: 'from-[rgb(var(--success-green))]',
    via: 'via-[rgb(var(--accent-cream))]',
    to: 'to-[rgb(var(--accent-sand))]'
  },
  warning: {
    from: 'from-[rgb(var(--warning-yellow))]',
    via: 'via-[rgb(var(--primary-gold))]',
    to: 'to-[rgb(var(--accent-highlight))]'
  },
  info: {
    from: 'from-[rgb(var(--primary-blue))]',
    via: 'via-[rgb(var(--accent-cream))]',
    to: 'to-[rgb(var(--accent-warmgray))]'
  }
};
