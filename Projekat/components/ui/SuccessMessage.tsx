import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium"
      style={{
        backgroundColor: 'rgb(var(--rgb-herbal-gold) / 0.15)',
        borderColor: 'var(--color-herbal-gold)',
        color: 'var(--color-text-main)',
      }}
    >
      <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--color-deep-teal)' }} />
      {message}
    </div>
  );
}
