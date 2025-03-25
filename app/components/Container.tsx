import React from 'react';

type ContainerWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

interface ContainerProps {
  children: React.ReactNode;
  width?: ContainerWidth;
  padding?: ContainerPadding;
  className?: string;
  centered?: boolean;
}

export default function Container({
  children,
  width = 'lg',
  padding = 'md',
  className = '',
  centered = true,
}: ContainerProps) {
  // Width maps
  const widthMap: Record<ContainerWidth, string> = {
    'xs': 'max-w-screen-xs',
    'sm': 'max-w-screen-sm',
    'md': 'max-w-screen-md',
    'lg': 'max-w-screen-lg',
    'xl': 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    'full': 'w-full',
  };

  // Padding maps
  const paddingMap: Record<ContainerPadding, string> = {
    'none': 'px-0',
    'sm': 'px-4 sm:px-6',
    'md': 'px-6 sm:px-8',
    'lg': 'px-8 sm:px-12',
  };

  // Centering
  const centeringClasses = centered ? 'mx-auto' : '';

  return (
    <div
      className={`
        ${widthMap[width]} ${paddingMap[padding]} ${centeringClasses} ${className}
      `}
    >
      {children}
    </div>
  );
} 