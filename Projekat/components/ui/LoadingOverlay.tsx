'use client';

import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';

const LOADING_MESSAGES = [
  'Prijavljivanje u sistem...',
  'Provjera podataka...',
  'Učitavanje informacija...',
  'Gotovo za trenutak...',
];

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message }: LoadingOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1300);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(242, 230, 216, 0.93)' }}
      aria-live="assertive"
      aria-label="Učitavanje"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <Settings
            className="absolute h-20 w-20 animate-spin-gear"
            style={{ color: '#2C444D' }}
            strokeWidth={1.2}
          />
          <Settings
            className="absolute h-9 w-9 animate-spin-gear-reverse"
            style={{ color: '#5A7C83' }}
            strokeWidth={1.5}
          />
        </div>
        <p
          key={messageIndex}
          className="animate-fade-up text-sm font-medium tracking-wide"
          style={{ color: '#1F2A30' }}
        >
          {message ?? LOADING_MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  );
}
