'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  endAdornment?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, endAdornment, className = '', ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: '#1F2A30' }}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            {...props}
            className={[
              'w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200',
              'placeholder:text-[#6B7C82]/60',
              'focus:outline-none focus:ring-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              endAdornment ? 'pr-11' : '',
              error
                ? 'border-[#8B4A2B] bg-[#8B4A2B]/5 focus:ring-[#8B4A2B]/25 focus:border-[#8B4A2B]'
                : 'border-[#CCB68E] bg-white/60 hover:border-[#5A7C83] focus:border-[#5A7C83] focus:ring-[#5A7C83]/20',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ color: '#1F2A30' }}
          />
          {endAdornment && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {endAdornment}
            </div>
          )}
        </div>
        {error && <ErrorMessage message={error} />}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
