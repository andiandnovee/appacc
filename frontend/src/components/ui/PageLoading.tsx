import styles from "./PageLoading.module.css";

interface PageLoadingProps {
  label?: string;
}

export default function PageLoading({ label = "Memuat halaman" }: PageLoadingProps) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <div className={styles.orbit} aria-hidden="true">
        <span className={styles.orbitDot} />
        <span className={styles.orbitDot} />
        <span className={styles.orbitDot} />
        <span className={styles.centerMark}>A</span>
      </div>
      <span className={styles.label}>{label}<span className={styles.dots} aria-hidden="true">...</span></span>
    </div>
  );
}
