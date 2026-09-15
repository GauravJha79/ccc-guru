import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = true }: CardProps) {
  return (
    <div className={cn('card', hoverable && 'group cursor-pointer', className)}>
      {children}
    </div>
  );
}
