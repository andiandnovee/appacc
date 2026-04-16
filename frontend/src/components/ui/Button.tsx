import {
  useState,
  useRef,
  useEffect,
  ReactNode,
  ElementType,
  ComponentPropsWithoutRef,
} from 'react';
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './Button.module.css';

/* ════════════════════════════════════════════════════════════
   Button
   ════════════════════════════════════════════════════════════ */

export interface ButtonProps<T extends ElementType = 'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  as?: T;
  children?: ReactNode;
  className?: string;
}

export const Button = <T extends ElementType = 'button'>({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  as: Tag = 'button' as T,
  children,
  className = '',
  rest
}: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) => {
  const isDisabled = disabled || loading;

  const btnClass = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    isDisabled ? styles.btnDisabled : '',
    !children ? styles.iconOnly : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Kalau Tag = 'button', tambahkan type="button" supaya tidak submit form
  const tagProps = Tag === 'button'
    ? ({ type: 'button', disabled: isDisabled, rest } as any)
    : ({ 'aria-disabled': isDisabled,rest } as any);

  return (
    <Tag className={btnClass} {...tagProps}>
      {/* Loading state */}
      {loading && (
        <span className={styles.spinnerWrapper} aria-hidden="true">
          <span className={styles.spinner} />
          {children && <span>Memuat...</span>}
        </span>
      )}

      {/* Konten (disembunyikan saat loading agar lebar tetap terjaga) */}
      <span className={loading ? styles.loadingContent : undefined}>
        {iconLeft && <span aria-hidden="true">{iconLeft}</span>}
        {children}
        {iconRight && <span aria-hidden="true">{iconRight}</span>}
      </span>
    </Tag>
  );
};

/* ════════════════════════════════════════════════════════════
   SplitButton
   ════════════════════════════════════════════════════════════ */

export interface SplitButtonOption {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  as?: ElementType;
  href?: string;
  to?: string;
}

export interface SplitButtonProps {
  label: string;
  onClick: () => void;
  options?: SplitButtonOption[];
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const SplitButton = ({
  label,
  onClick,
  options = [],
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
}: SplitButtonProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  // Variant ghost/outline pakai divider gelap
  const needDarkDivider = variant === 'ghost' || variant === 'outline';

  return (
    <div
      ref={wrapperRef}
      className={`${styles.splitWrapper} ${fullWidth ? styles.fullWidth : ''}`}
    >
      {/* Tombol utama */}
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        className={`${styles.splitMain} ${needDarkDivider ? styles.splitDividerDark : ''}`}
      >
        {label}
      </Button>

      {/* Chevron toggle */}
      <Button
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={() => setOpen((v) => !v)}
        className={styles.splitChevron}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Tampilkan opsi lain"
      >
        <ChevronDown
          size={14}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: `transform var(--duration-fast) var(--ease-default)`,
          }}
        />
      </Button>

      {/* Dropdown */}
      {open && options.length > 0 && (
        <div className={styles.splitDropdown} role="menu">
          {options.map((opt, i) => {
            const Tag = opt.as ?? 'button';
            const props =
              Tag === 'button'
                ? {
                    type: 'button',
                    onClick: () => {
                      opt.onClick?.();
                      setOpen(false);
                    },
                  }
                : { href: opt.href, to: opt.to, onClick: () => setOpen(false) };

            return (
              <Tag
                key={i}
                className={styles.splitDropdownItem}
                role="menuitem"
                {...props}
              >
                {opt.icon && <span aria-hidden="true">{opt.icon}</span>}
                {opt.label}
              </Tag>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Default export = Button
export default Button;