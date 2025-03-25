import React from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';
type CardSize = 'sm' | 'md' | 'lg' | 'xl';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
  padding?: CardPadding;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  size = 'md',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false,
}: CardProps) {
  // Size maps
  const sizeMap: Record<CardSize, string> = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
  };

  // Padding maps
  const paddingMap: Record<CardPadding, string> = {
    'none': 'p-0',
    'sm': 'p-3',
    'md': 'p-5',
    'lg': 'p-7',
  };

  // Variant styles
  let variantClasses = '';
  
  switch (variant) {
    case 'elevated':
      variantClasses = 'bg-white shadow-md border border-gray-200';
      break;
    case 'outlined':
      variantClasses = 'bg-white border border-gray-200';
      break;
    case 'glass':
      variantClasses = 'glass-light';
      break;
    default:
      variantClasses = 'bg-white shadow-sm';
      break;
  }

  // Hover effect
  const hoverClasses = hoverable ? 'transition-all duration-300 hover:shadow-md hover:-translate-y-1' : '';

  // Cursor style for clickable cards
  const cursorClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`
        rounded-xl overflow-hidden ${variantClasses} ${sizeMap[size]} ${paddingMap[padding]}
        ${hoverClasses} ${cursorClasses} ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
} 