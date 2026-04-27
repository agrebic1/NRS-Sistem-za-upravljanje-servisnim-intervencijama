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
    bg: 'rgb(var(--rgb-celestial-teal) / 0.08)',
    border: 'var(--color-celestial-teal)',
    text: 'var(--color-deep-teal)',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 flex-shrink-0" />,
    bg: 'rgb(var(--rgb-herbal-gold) / 0.15)',
    border: 'var(--color-herbal-gold)',
    text: 'var(--color-text-main)',
  },
  error: {
    icon: <XCircle className="h-4 w-4 flex-shrink-0" />,
    bg: 'rgb(var(--rgb-mystic-ember) / 0.08)',
    border: 'var(--color-mystic-ember)',
    text: 'var(--color-mystic-ember)',
  },
  success: {
    icon: <CheckCircle className="h-4 w-4 flex-shrink-0" />,
    bg: 'rgb(var(--rgb-herbal-gold) / 0.15)',
    border: 'var(--color-herbal-gold)',
    text: 'var(--color-text-main)',
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
