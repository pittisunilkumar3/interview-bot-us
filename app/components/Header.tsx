import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from './Container';
import Button from './Button';

interface HeaderProps {
  transparent?: boolean;
  className?: string;
}

export default function Header({
  transparent = false,
  className = '',
}: HeaderProps) {
  const bgClasses = transparent 
    ? 'bg-transparent' 
    : 'bg-white border-b border-gray-200';

  return (
    <header className={`py-4 ${bgClasses} ${className}`}>
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="JobeasyO Logo"
                width={36}
                height={36}
                className="h-9 w-auto"
              />
              <span className="text-xl font-bold text-gray-800">JobeasyO</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/features" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Call-to-action buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </div>
        </nav>
      </Container>
    </header>
  );
} 