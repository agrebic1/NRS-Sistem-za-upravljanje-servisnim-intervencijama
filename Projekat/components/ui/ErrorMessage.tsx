import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p
      role="alert"
      className="flex items-center gap-1.5 text-xs font-medium"
      style={{ color: 'var(--first-senary)' }}
    >
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}
