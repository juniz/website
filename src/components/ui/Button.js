'use client';

import styles from './Button.module.css';

/**
 * Button component
 * @param {'primary'|'outline'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {string} className
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        styles.btn,
        styles[`btn-${variant}`],
        styles[`btn-${size}`],
        isDisabled ? styles['btn-disabled'] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="31.4 31.4"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      )}
      <span className={loading ? styles['btn-label-loading'] : ''}>{children}</span>
    </button>
  );
}
