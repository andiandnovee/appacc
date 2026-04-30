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
  /** Locale untuk Intl.NumberFormat. Default: 'id-ID' (1.000,00) */
  locale?: string;
  /**
   * Jumlah digit desimal. Default: 0.
   * Cara kerja: value dianggap integer mentah, lalu dibagi 10^decimalScale.
   * Contoh decimalScale=2: input digit "150000" → tampil "1.500,00"
   */
  decimalScale?: number;
  /** Prefix tampilan, misal 'Rp ' */
  prefix?: string;
  /** Suffix tampilan, misal ' kg' */
  suffix?: string;
  /**
   * Callback dengan nilai numerik mentah.
   * Berguna jika parent butuh angka, bukan formatted string.
   */
  onValueChange?: (raw: number) => void;
  [key: string]: any;
}

// ── Icons ──────────────────────────────────────────────────────────────────
const IconEmail  = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12v8.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V4z" stroke="currentColor" strokeWidth="1.3"/><path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const IconUrl    = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const IconTel    = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.5 2.5h-2a1 1 0 00-1 1C2.5 9.956 7.044 14.5 13.5 14.5a1 1 0 001-1v-2a1 1 0 00-1-1l-2.5-.5a1 1 0 00-.9.3l-1 1a8.07 8.07 0 01-3.4-3.4l1-1a1 1 0 00.3-.9L6.5 3.5a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const IconSearch = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const IconEye    = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>);
const IconEyeOff = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M6.5 6.6A2 2 0 0010 9.9M4.5 4.6C2.9 5.7 1.5 8 1.5 8s2.5 5 6.5 5c1.3 0 2.5-.4 3.5-1M6 3.2C6.6 3.1 7.3 3 8 3c4 0 6.5 5 6.5 5s-.6 1.2-1.7 2.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const IconClear  = () => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>);

const TYPE_PRESETS: Record<string, { iconLeft?: React.ReactElement }> = {
  email:  { iconLeft: <IconEmail /> },
  url:    { iconLeft: <IconUrl /> },
  tel:    { iconLeft: <IconTel /> },
  search: { iconLeft: <IconSearch /> },
};

// ── useNumberFormat ────────────────────────────────────────────────────────
/**
 * Hook untuk mengelola display & onChange input angka dengan thousand separator.
 *
 * FIX v2 — root cause "digit hilang":
 *
 * Siklus bug sebelumnya:
 *   user ketik → handleChange → setDisplay("250.600") → onChange → parent setState
 *   → value prop berubah ke "250.600" (formatted) → useEffect [value] terpicu
 *   → format("250.600") dipanggil lagi → digits="250600" → display="250.600" (ok)
 *
 *   Tapi race condition terjadi saat parent menyimpan formatted string ke state
 *   dan mengirimnya balik sebagai value prop. Pada skenario tertentu (PPN effect,
 *   PO lookup), value yang datang adalah raw number string ("250600") yang kemudian
 *   di-format ulang oleh useEffect, menimpa display yang sedang user edit.
 *
 * Solusi: isUserTyping ref sebagai guard.
 *   - Set true di awal handleChange, false setelah setTimeout(0).
 *   - useEffect [value] skip jika isUserTyping === true.
 *   - setTimeout(0) memastikan React sudah selesai flush semua setState
 *     sebelum flag direset, sehingga useEffect yang dipicu oleh onChange
 *     parent tidak menimpa display.
 */
function useNumberFormat({
  value,
  locale = 'id-ID',
  decimalScale = 0,
  prefix = '',
  suffix = '',
  onChange,
  onValueChange,
}: {
  value?: string | number;
  locale?: string;
  decimalScale?: number;
  prefix?: string;
  suffix?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (raw: number) => void;
}) {
  const isUserTyping = React.useRef(false);

  const format = React.useCallback(
    (raw: string | number | undefined): string => {
      if (raw === '' || raw === undefined || raw === null) return '';
      const digits = String(raw).replace(/[^\d]/g, '');
      if (digits === '') return '';
      const numeric = Number(digits) / Math.pow(10, decimalScale);
      const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimalScale,
        maximumFractionDigits: decimalScale,
      }).format(numeric);
      return `${prefix}${formatted}${suffix}`;
    },
    [locale, decimalScale, prefix, suffix]
  );

  const [display, setDisplay] = React.useState<string>(() => format(value));

  // Sync dari luar: PO lookup, PPN effect, edit mode populate, reset form.
  // Skip saat user sedang mengetik agar digit tidak tertimpa.
  React.useEffect(() => {
    if (isUserTyping.current) return;
    setDisplay(format(value));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Reformat saat developer ganti locale/prefix/suffix/decimalScale.
  React.useEffect(() => {
    setDisplay(prev => (prev === '' ? '' : format(prev)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      isUserTyping.current = true;

      const raw = e.target.value;

      if (raw === '' || raw === prefix || raw === `${prefix}${suffix}`) {
        setDisplay('');
        onChange?.({ ...e, target: { ...e.target, value: '' } } as React.ChangeEvent<HTMLInputElement>);
        onValueChange?.(0);
        setTimeout(() => { isUserTyping.current = false; }, 0);
        return;
      }

      const digits = raw.replace(/[^\d]/g, '');
      if (digits === '') {
        setTimeout(() => { isUserTyping.current = false; }, 0);
        return;
      }

      const formatted = format(digits);
      setDisplay(formatted);

      onChange?.({ ...e, target: { ...e.target, value: formatted } } as React.ChangeEvent<HTMLInputElement>);

      const numericValue = Number(digits) / Math.pow(10, decimalScale);
      onValueChange?.(numericValue);

      // Reset flag setelah React selesai flush semua update yang dipicu onChange
      setTimeout(() => { isUserTyping.current = false; }, 0);
    },
    [format, prefix, suffix, decimalScale, onChange, onValueChange]
  );

  return { display, handleChange };
}

// ── Input (component utama) ────────────────────────────────────────────────
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
    locale = 'id-ID',
    decimalScale = 0,
    prefix = '',
    suffix = '',
    onValueChange,
    ...rest
  } = props;

  const id = React.useId();
  const [showPassword, setShowPassword] = React.useState(false);

  // ── Textarea ──────────────────────────────────────────────────────────────
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

  // ── Number ────────────────────────────────────────────────────────────────
  if (type === 'number') {
    return (
      <NumberInput
        id={id}
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        onValueChange={onValueChange}
        locale={locale}
        decimalScale={decimalScale}
        prefix={prefix}
        suffix={suffix}
        label={label}
        placeholder={placeholder}
        hint={hint}
        error={error}
        size={size}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        iconLeft={iconLeft}
        iconRight={iconRight}
        {...rest}
      />
    );
  }

  // ── Input biasa ───────────────────────────────────────────────────────────
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
      onChange({
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
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

// ── NumberInput sub-component ──────────────────────────────────────────────
interface NumberInputProps {
  id: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onValueChange?: (raw: number) => void;
  locale?: string;
  decimalScale?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  [key: string]: any;
}

const NumberInput: React.FC<NumberInputProps> = ({
  id, value, onChange, onValueChange,
  locale, decimalScale, prefix, suffix,
  label, placeholder, hint, error,
  size = 'md', disabled, readOnly, required,
  iconLeft, iconRight, ...rest
}) => {
  const { display, handleChange } = useNumberFormat({
    value, locale, decimalScale, prefix, suffix, onChange, onValueChange,
  });

  const inputClass = [
    styles.input,
    styles[size],
    styles.numberInput,
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
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={inputClass}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...rest}
        />
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </div>
      {error && <p id={`${id}-error`} className={`${styles.message} ${styles.messageError}`} role="alert">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className={`${styles.message} ${styles.messageHint}`}>{hint}</p>}
    </div>
  );
};

export default Input;