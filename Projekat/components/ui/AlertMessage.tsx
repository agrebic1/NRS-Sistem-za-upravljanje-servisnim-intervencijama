import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type AlertVariant = 'info' | 'warning' | 'error' | 'success';

interface AlertConfig {
  icon: ReactNode;
  bg: string;
  border: string;
  text: string;
}

const ALERT_CONFIG: Record<AlertVariant, AlertConfig> = {
  info: {
    icon: <Info className="h-4 w-4 flex-shrink-0" />,
    bg: 'rgba(90, 124, 131, 0.08)',
    border: '#5A7C83',
    text: '#2C444D',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 flex-shrink-0" />,
    bg: 'rgba(212, 178, 127, 0.15)',
    border: '#D4B27F',
    text: '#1F2A30',
  },
  error: {
    icon: <XCircle className="h-4 w-4 flex-shrink-0" />,
    bg: 'rgba(139, 74, 43, 0.08)',
    border: '#8B4A2B',
    text: '#8B4A2B',
  },
  success: {
    icon: <CheckCircle className="h-4 w-4 flex-shrink-0" />,
    bg: 'rgba(212, 178, 127, 0.15)',
    border: '#D4B27F',
    text: '#1F2A30',
  },
};

interface AlertMessageProps {
  variant: AlertVariant;
  message: string | ReactNode;
}

export function AlertMessage({ variant, message }: AlertMessageProps) {
  const cfg = ALERT_CONFIG[variant];

  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium"
      style={{
        backgroundColor: cfg.bg,
        borderColor: cfg.border,
        color: cfg.text,
      }}
    >
      <span style={{ color: cfg.border }}>{cfg.icon}</span>
      <span>{message}</span>
    </div>
  );
}
