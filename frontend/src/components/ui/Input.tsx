import * as React from 'react';
import { Button } from './Button';
import styles from './Input.module.css';

type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea';

interface InputProps {
  type?: InputType;
  label?: string;
  hint?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  rows?: number;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  step?: string;
  min?: string;
  max?: string;
  [key: string]: any;
}

// Icons (sama)
const IconEmail = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12v8.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V4z" stroke="currentColor" strokeWidth="1.3"/><path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const IconUrl = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const IconTel = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.5 2.5h-2a1 1 0 00-1 1C2.5 9.956 7.044 14.5 13.5 14.5a1 1 0 001-1v-2a1 1 0 00-1-1l-2.5-.5a1 1 0 00-.9.3l-1 1a8.07 8.07 0 01-3.4-3.4l1-1a1 1 0 00.3-.9L6.5 3.5a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const IconSearch = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const IconEye = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>);
const IconEyeOff = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M6.5 6.6A2 2 0 0010 9.9M4.5 4.6C2.9 5.7 1.5 8 1.5 8s2.5 5 6.5 5c1.3 0 2.5-.4 3.5-1M6 3.2C6.6 3.1 7.3 3 8 3c4 0 6.5 5 6.5 5s-.6 1.2-1.7 2.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const IconClear = () => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>);

const TYPE_PRESETS: Record<string, { iconLeft?: React.ReactElement }> = {
  email: { iconLeft: <IconEmail /> },
  url: { iconLeft: <IconUrl /> },
  tel: { iconLeft: <IconTel /> },
  search: { iconLeft: <IconSearch /> },
};

const Input: React.FC<InputProps> = (props) => {
  const {
    value,
    onChange,
    type = 'text',
    label,
    placeholder,
    hint,
    error,
    size = 'md',
    disabled = false,
    readOnly = false,
    required = false,
    rows = 4,
    iconLeft,
    iconRight,
    ...rest
  } = props;

  const id = React.useId();
  const [showPassword, setShowPassword] = React.useState(false);

  // Jika textarea, render langsung dan return
  if (type === 'textarea') {
    const inputClass = [
      styles.textarea,
      styles[size],
      error ? styles.error : '',
      iconLeft ? styles.hasIconLeft : '',
      iconRight ? styles.hasIconRight : '',
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={id} className={`${styles.label} ${required ? styles.labelRequired : ''}`}>
            {label}
          </label>
        )}
        <div className={styles.container}>
          {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
          <textarea
            id={id}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            className={inputClass}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          />
          {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
        </div>
        {error && <p id={`${id}-error`} className={`${styles.message} ${styles.messageError}`} role="alert">{error}</p>}
        {!error && hint && <p id={`${id}-hint`} className={`${styles.message} ${styles.messageHint}`}>{hint}</p>}
      </div>
    );
  }

  // Untuk non-textarea (input biasa)
  const showClear = type === 'search' && value && String(value).length > 0;
  const resolvedType = type === 'password' && showPassword ? 'text' : type;

  const presetIconLeft = TYPE_PRESETS[type]?.iconLeft ?? null;
  const resolvedIconLeft = iconLeft ?? presetIconLeft;
  const hasRightControl = type === 'password' || showClear;
  const resolvedIconRight = !hasRightControl ? iconRight : null;

  const inputClass = [
    styles.input,
    styles[size],
    error ? styles.error : '',
    resolvedIconLeft ? styles.hasIconLeft : '',
    resolvedIconRight || hasRightControl ? styles.hasIconRight : '',
  ].filter(Boolean).join(' ');

  const handleClear = () => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={`${styles.label} ${required ? styles.labelRequired : ''}`}>
          {label}
        </label>
      )}
      <div className={styles.container}>
        {resolvedIconLeft && <span className={styles.iconLeft}>{resolvedIconLeft}</span>}
        <input
          id={id}
          type={resolvedType}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={inputClass}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...rest}
        />
        {resolvedIconRight && !hasRightControl && <span className={styles.iconRight}>{resolvedIconRight}</span>}
        {type === 'password' && (
          <Button
            variant="ghost"
            size="sm"
            iconLeft={showPassword ? <IconEyeOff /> : <IconEye />}
            onClick={() => setShowPassword(v => !v)}
            className={styles.toggleBtn}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          />
        )}
        {showClear && (
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<IconClear />}
            onClick={handleClear}
            className={styles.clearBtn}
            aria-label="Hapus pencarian"
          />
        )}
      </div>
      {error && <p id={`${id}-error`} className={`${styles.message} ${styles.messageError}`} role="alert">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className={`${styles.message} ${styles.messageHint}`}>{hint}</p>}
    </div>
  );
};

export default Input;