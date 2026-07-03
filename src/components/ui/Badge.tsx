import * as React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  color?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'info', color, dot = false, children, className = '' }: BadgeProps) {
  // Use color as variant if provided (for backward compatibility or convenience)
  const activeVariant = color || variant;
  
  const variantStyles = {
    success: {
      background: 'var(--color-accent-teal-light)',
      color: '#085041',
    },
    warning: {
      background: 'var(--color-warning-light)',
      color: '#633806',
    },
    danger: {
      background: 'var(--color-danger-light)',
      color: '#791F1F',
    },
    info: {
      background: 'var(--color-primary-50)',
      color: 'var(--color-primary-800)',
    },
    neutral: {
      background: '#f3f4f6',
      color: '#374151',
    },
  };

  const dotColors = {
    success: 'var(--color-accent-teal)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    info: 'var(--color-primary-400)',
    neutral: '#9ca3af',
  };

  const style = variantStyles[activeVariant] ?? variantStyles.info;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.1875rem 0.625rem',
        borderRadius: '999px',
        fontSize: '0.6875rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
        background: style.background,
        color: style.color,
      }}
      className={className}
    >
      {dot && (
        <span
          aria-hidden="true"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: dotColors[activeVariant],
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
