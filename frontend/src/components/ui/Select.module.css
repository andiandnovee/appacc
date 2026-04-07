/* ============================================================
   Select.module.css
   Semua nilai merujuk ke CSS variables dari tokens.css
   ============================================================ */

/* ── Wrapper ───────────────────────────────────────────────── */
.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* ── Label ─────────────────────────────────────────────────── */
.label {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  line-height: var(--leading-tight);
}

.labelRequired::after {
  content: ' *';
  color: var(--color-danger);
}

/* ── Container (posisi chevron icon) ───────────────────────── */
.container {
  position: relative;
  display: flex;
  align-items: center;
}

/* ── Select element ────────────────────────────────────────── */
.select {
  width: 100%;
  font-family: var(--font-sans);
  font-weight: var(--font-normal);
  color: var(--text-primary);
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-default);
  border-radius: var(--radius-md);
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;

  /* Ruang untuk chevron icon di kanan */
  padding-right: calc(var(--space-3) * 2 + 16px);

  transition:
    border-color var(--duration-normal) var(--ease-default),
    box-shadow   var(--duration-normal) var(--ease-default),
    background-color var(--duration-fast) var(--ease-default);
}

/* Focus */
.select:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(84, 112, 239, 0.15);
}

/* ── Sizes ─────────────────────────────────────────────────── */
.sm {
  padding-top:    var(--space-2);
  padding-bottom: var(--space-2);
  padding-left:   var(--space-3);
  font-size: var(--text-xs);
}

.md {
  padding-top:    var(--space-2);
  padding-bottom: var(--space-2);
  padding-left:   var(--space-3);
  font-size: var(--text-sm);
}

.lg {
  padding-top:    var(--space-3);
  padding-bottom: var(--space-3);
  padding-left:   var(--space-4);
  font-size: var(--text-base);
}

/* ── Error state ───────────────────────────────────────────── */
.error {
  border-color: var(--color-danger);
}

.error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

/* ── Disabled state ────────────────────────────────────────── */
.select:disabled {
  background-color: var(--bg-surface-2);
  color: var(--text-disabled);
  border-color: var(--border-subtle);
  cursor: not-allowed;
}

/* ── Placeholder option (warna lebih redup) ────────────────── */
.select option[value=''] {
  color: var(--text-tertiary);
}

/* ── Chevron icon ──────────────────────────────────────────── */
.chevron {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--text-tertiary);
  pointer-events: none;    /* klik tetap tembus ke select */
  transition: color var(--duration-fast) var(--ease-default);
}

/* Chevron ikut warna disabled */
.wrapper:has(.select:disabled) .chevron {
  color: var(--text-disabled);
}

/* ── Hint & Error message ──────────────────────────────────── */
.message {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  margin: 0;
}

.messageHint  { color: var(--text-tertiary); }
.messageError { color: var(--color-danger);  }
