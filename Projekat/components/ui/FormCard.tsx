import type { ReactNode } from 'react';

type CardMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: CardMaxWidth;
}

const MAX_WIDTH_CLASSES: Record<CardMaxWidth, string> = {
  sm:  'max-w-sm',
  md:  'max-w-md',
  lg:  'max-w-lg',
  xl:  'max-w-xl',
  '2xl': 'max-w-2xl',
};

export function FormCard({
  title,
  subtitle,
  children,
  maxWidth = 'md',
}: FormCardProps) {
  return (
    <div
      className={`w-full ${MAX_WIDTH_CLASSES[maxWidth]} rounded-2xl p-8 shadow-card-lg`}
      style={{
        backgroundColor: 'rgba(199, 184, 164, 0.22)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(204, 182, 142, 0.35)',
      }}
    >
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1F2A30' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm" style={{ color: '#6B7C82' }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
