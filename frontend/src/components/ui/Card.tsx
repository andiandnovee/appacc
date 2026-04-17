import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  variant?: 'default' | 'flat' | 'raised' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

function Card({
  variant = 'default',
  padding = 'none',
  hoverable = false,
  fullWidth = false,
  onClick,
  className = '',
  children,
}: CardProps) {
  const cardClass = [
    styles.card,
    variant !== 'default' ? styles[variant] : '',
    padding !== 'none' ? styles[`pad${capitalize(padding)}`] : '',
    hoverable ? styles.hoverable : '',
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClass}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    >
      {children}
    </div>
  );
}

/* ── Card.Header ── */
interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
}

function CardHeader({ title, subtitle, action, children }: CardHeaderProps) {
  return (
    <div className={styles.header}>
      {children ? (
        children
      ) : (
        <div className={styles.headerTitle}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      {action && <div className={styles.headerAction}>{action}</div>}
    </div>
  );
}

/* ── Card.Body ── */
interface CardBodyProps {
  children?: ReactNode;
}

function CardBody({ children }: CardBodyProps) {
  return <div className={styles.body}>{children}</div>;
}

/* ── Card.Footer ── */
interface CardFooterProps {
  align?: 'right' | 'left' | 'between';
  children?: ReactNode;
}

function CardFooter({ align = 'right', children }: CardFooterProps) {
  const footerClass = [
    styles.footer,
    align === 'left' ? styles.footerLeft : '',
    align === 'between' ? styles.footerBetween : '',
  ]
    .filter(Boolean)
    .join(' ');
  return <div className={footerClass}>{children}</div>;
}

/* ── Helper ── */
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ── Attach subkomponen ── */
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;