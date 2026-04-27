'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  showCharacterCount?: boolean;
  maxCharacters?: number;
  currentLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      id,
      showCharacterCount,
      maxCharacters,
      currentLength = 0,
      ...props
    },
    ref
  ) => {
    const textareaId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const isOverLimit = maxCharacters !== undefined && currentLength > maxCharacters;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={textareaId}
          className="text-sm font-medium"
          style={{ color: '#1F2A30' }}
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          {...props}
          className={[
            'w-full resize-none rounded-xl border px-4 py-2.5 text-sm transition-all duration-200',
            'placeholder:text-[#6B7C82]/60',
            'focus:outline-none focus:ring-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-[#8B4A2B] bg-[#8B4A2B]/5 focus:ring-[#8B4A2B]/25 focus:border-[#8B4A2B]'
              : 'border-[#CCB68E] bg-white/60 hover:border-[#5A7C83] focus:border-[#5A7C83] focus:ring-[#5A7C83]/20',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ color: '#1F2A30' }}
        />
        <div className="flex items-center justify-between">
          {error ? <ErrorMessage message={error} /> : <span />}
          {showCharacterCount && maxCharacters !== undefined && (
            <span
              className="text-xs font-medium"
              style={{ color: isOverLimit ? '#8B4A2B' : '#6B7C82' }}
            >
              {currentLength}/{maxCharacters}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
