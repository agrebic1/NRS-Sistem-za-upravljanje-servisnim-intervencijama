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
        backgroundColor: 'rgba(212, 178, 127, 0.15)',
        borderColor: '#D4B27F',
        color: '#1F2A30',
      }}
    >
      <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: '#2C444D' }} />
      {message}
    </div>
  );
}
