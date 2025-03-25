import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  fullWidth?: boolean;
  ariaLabel?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  icon,
  fullWidth = false,
  ariaLabel,
}: ButtonProps) {
  // Size maps
  const sizeMap: Record<ButtonSize, string> = {
    'xs': 'text-xs px-2.5 py-1.5 rounded-md',
    'sm': 'text-sm px-3 py-2 rounded-md',
    'md': 'text-base px-4 py-2.5 rounded-lg',
    'lg': 'text-lg px-5 py-3 rounded-lg',
  };

  // Variant styles
  let variantClasses = '';
  
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-[rgb(var(--primary-blue))] text-white hover:bg-[rgb(var(--primary-blue))/90] shadow-sm';
      break;
    case 'secondary':
      variantClasses = 'bg-[rgb(var(--primary-gold))] text-white hover:bg-[rgb(var(--primary-gold))/90] shadow-sm';
      break;
    case 'outline':
      variantClasses = 'bg-transparent border border-[rgb(var(--neutral-300))] text-[rgb(var(--neutral-700))] hover:bg-[rgb(var(--neutral-100))]';
      break;
    case 'ghost':
      variantClasses = 'bg-transparent text-[rgb(var(--neutral-700))] hover:bg-[rgb(var(--neutral-100))]';
      break;
    case 'link':
      variantClasses = 'bg-transparent text-[rgb(var(--primary-blue))] hover:text-[rgb(var(--primary-blue))/80] underline-offset-4 hover:underline p-0';
      break;
  }

  // States
  const disabledClasses = disabled || loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center font-medium transition-all duration-200
        ${sizeMap[size]} ${variantClasses} ${disabledClasses} ${widthClasses} ${className}
        focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-blue))/20] focus:ring-offset-1
      `}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
} 