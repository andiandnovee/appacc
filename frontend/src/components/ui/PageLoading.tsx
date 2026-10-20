import styles from "./PageLoading.module.css";

interface PageLoadingProps {
  label?: string;
}

export default function PageLoading({ label = "Memuat halaman" }: PageLoadingProps) {
  return (
    <main className={styles.screen} role="status" aria-live="polite" aria-label={label}>
      <div className={styles.ambient} aria-hidden="true" />
      <section className={styles.panel}>
        <div className={styles.mark} aria-hidden="true">
          <span className={styles.orbit} />
          <span className={styles.orbitInner} />
          <span className={styles.markCore}>A</span>
          <span className={`${styles.spark} ${styles.sparkOne}`} />
          <span className={`${styles.spark} ${styles.sparkTwo}`} />
          <span className={`${styles.spark} ${styles.sparkThree}`} />
        </div>
        <span className={styles.brand}>APPACC</span>
        <h1 className={styles.title}>{label}</h1>
        <p className={styles.caption}>Sebentar, data dan tampilan sedang disiapkan.</p>
        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressBar} />
        </div>
        <div className={styles.loadingLabel} aria-hidden="true">
          <span>Mohon tunggu</span>
          <span className={styles.dots}><i /><i /><i /></span>
        </div>
      </section>
    </main>
  );
}
