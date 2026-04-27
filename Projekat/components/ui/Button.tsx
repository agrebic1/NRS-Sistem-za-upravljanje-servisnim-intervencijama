'use client';

import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
}

// All hover states handled via Tailwind — no JS event handlers needed.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: [
    'bg-[#2C444D] text-white',
    'hover:bg-[#5A7C83]',
    'disabled:opacity-50 disabled:hover:bg-[#2C444D]',
    'transition-colors duration-200',
  ].join(' '),
  secondary: [
    'bg-transparent text-[#2C444D]',
    'border border-[#CCB68E]',
    'hover:border-[#5A7C83] hover:bg-[#5A7C83]/5',
    'disabled:opacity-50',
    'transition-colors duration-200',
  ].join(' '),
  danger: [
    'bg-[#8B4A2B] text-white',
    'hover:bg-[#8B4A2B]/80',
    'disabled:opacity-50',
    'transition-colors duration-200',
  ].join(' '),
  ghost: [
    'bg-transparent text-[#6B7C82]',
    'hover:bg-[#C7B8A4]/30 hover:text-[#1F2A30]',
    'disabled:opacity-50',
    'transition-colors duration-200',
  ].join(' '),
  outline: [
    'bg-transparent border-2 border-[#2C444D] text-[#2C444D]',
    'hover:bg-[#2C444D] hover:text-white',
    'disabled:opacity-50',
    'transition-colors duration-200',
  ].join(' '),
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2 text-sm rounded-xl',
  lg: 'px-7 py-3 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold',
        'focus:outline-none focus:ring-2 focus:ring-[#5A7C83]/40 focus:ring-offset-2',
        'disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ].join(' ')}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}
