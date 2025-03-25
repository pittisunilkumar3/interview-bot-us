import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[rgb(var(--primary-blue))] text-white hover:bg-[rgb(var(--primary-blue))/90",
        secondary: "bg-[rgb(var(--primary-gold))] text-black hover:bg-[rgb(var(--primary-gold))]/90",
        subtle: "bg-[rgba(var(--accent-sand),0.2)] text-gray-700 hover:bg-[rgba(var(--accent-sand),0.3)]",
        outline: "border border-[rgb(var(--primary-blue))] text-[rgb(var(--primary-blue))] hover:bg-[rgb(var(--primary-blue))]/10",
        success: "bg-green-100 text-green-800 hover:bg-green-200",
        warning: "bg-amber-100 text-amber-800 hover:bg-amber-200", 
        danger: "bg-red-100 text-red-800 hover:bg-red-200",
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
    },
  }
);

export interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  onClick?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, interactive, onClick, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, interactive }), className)}
        ref={ref}
        onClick={onClick}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge; 