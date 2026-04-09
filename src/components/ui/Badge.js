/**
 * Badge component
 * @param {'success'|'warning'|'danger'|'info'} variant
 * @param {boolean} dot — show colored dot indicator
 */
export default function Badge({ variant = 'info', dot = false, children, className = '' }) {
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
  };

  const dotColors = {
    success: 'var(--color-accent-teal)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    info: 'var(--color-primary-400)',
  };

  const style = variantStyles[variant] ?? variantStyles.info;

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
            backgroundColor: dotColors[variant],
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
