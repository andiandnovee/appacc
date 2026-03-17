import { useState, useRef } from 'react'
import { Upload, X, File } from 'lucide-react'
import styles from './FileUpload.module.css'

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getExt = (name) => name.split('.').pop()?.slice(0, 4) ?? 'file'

/**
 * FileUpload
 *
 * Props:
 * - onFilesChange  → (files: File[]) => void
 * - accept         → string misal "image/*,.pdf" (default: '*')
 * - multiple       → boolean (default: false)
 * - maxSize        → max bytes per file (default: 5MB)
 * - maxFiles       → max jumlah file (default: 5)
 * - label          → string
 * - hint           → string
 * - error          → string
 * - disabled       → boolean
 */
export default function FileUpload({
  onFilesChange,
  accept = '*',
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  label,
  hint,
  error: externalError,
  disabled = false,
}) {
  const [files,     setFiles]     = useState([])
  const [dragging,  setDragging]  = useState(false)
  const [internalError, setInternalError] = useState('')
  const inputRef = useRef(null)

  const error = externalError || internalError

  const validate = (incoming) => {
    if (files.length + incoming.length > maxFiles) {
      setInternalError(`Maksimal ${maxFiles} file`)
      return false
    }
    for (const f of incoming) {
      if (f.size > maxSize) {
        setInternalError(`File "${f.name}" melebihi ukuran maksimal (${formatSize(maxSize)})`)
        return false
      }
    }
    setInternalError('')
    return true
  }

  const addFiles = (incoming) => {
    const arr = Array.from(incoming)
    if (!validate(arr)) return
    const next = multiple ? [...files, ...arr] : arr
    setFiles(next)
    onFilesChange?.(next)
  }

  const removeFile = (i) => {
    const next = files.filter((_, idx) => idx !== i)
    setFiles(next)
    onFilesChange?.(next)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (!disabled) addFiles(e.dataTransfer.files)
  }

  return (
    <div className={styles.wrapper}>

      {label && <label className={styles.label}>{label}</label>}

      {/* Dropzone */}
      <div
        className={[
          styles.dropzone,
          dragging  ? styles.dropzoneDragging  : '',
          disabled  ? styles.dropzoneDisabled  : '',
        ].filter(Boolean).join(' ')}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        aria-label="Upload file"
      >
        <Upload size={32} className={styles.icon} strokeWidth={1.5} />
        <p className={styles.dropzoneText}>
          <strong>Klik untuk upload</strong> atau drag & drop
        </p>
        <p className={styles.dropzoneHint}>
          {accept !== '*' ? accept : 'Semua tipe file'} · Maks. {formatSize(maxSize)}
          {multiple ? ` · Maks. ${maxFiles} file` : ''}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        className={styles.hiddenInput}
        accept={accept}
        multiple={multiple}
        onChange={(e) => addFiles(e.target.files)}
        disabled={disabled}
      />

      {/* File list */}
      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map((file, i) => (
            <div key={i} className={styles.fileItem}>
              <div className={styles.fileIcon}>{getExt(file.name)}</div>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatSize(file.size)}</span>
              </div>
              <button
                type="button"
                className={styles.fileRemove}
                onClick={() => removeFile(i)}
                aria-label={`Hapus ${file.name}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className={`${styles.message} ${styles.messageError}`} role="alert">{error}</p>}
      {!error && hint && <p className={`${styles.message} ${styles.messageHint}`}>{hint}</p>}

    </div>
  )
}
