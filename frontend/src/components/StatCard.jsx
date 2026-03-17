import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from './Card'
import styles from './StatCard.module.css'

/**
 * StatCard
 *
 * Props:
 * - label      → string — nama metrik
 * - value      → string | number — nilai utama
 * - icon       → React node — icon
 * - iconVariant → 'primary'|'success'|'warning'|'danger'|'secondary' (default: 'primary')
 * - trend      → number — persentase perubahan (positif/negatif)
 * - trendDesc  → string — deskripsi trend, misal "vs bulan lalu"
 *
 * Contoh:
 * <StatCard label="Total Users" value="1,245" icon={<Users size={20}/>} trend={12} trendDesc="vs bulan lalu" />
 */
export default function StatCard({
  label,
  value,
  icon,
  iconVariant = 'primary',
  trend,
  trendDesc,
}) {
  const trendDir = trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'

  const TrendIcon = trendDir === 'up'
    ? TrendingUp
    : trendDir === 'down'
      ? TrendingDown
      : Minus

  return (
    <Card variant="outlined">
      <div className={styles.card}>

        {/* Label + Icon */}
        <div className={styles.header}>
          <p className={styles.label}>{label}</p>
          {icon && (
            <div className={`${styles.iconBox} ${styles[iconVariant]}`} aria-hidden="true">
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <p className={styles.value}>{value}</p>

        {/* Trend */}
        {trend !== undefined && (
          <div className={styles.footer}>
            <span className={`${styles.trend} ${styles[`trend${trendDir.charAt(0).toUpperCase() + trendDir.slice(1)}`]}`}>
              <TrendIcon size={10} />
              {Math.abs(trend)}%
            </span>
            {trendDesc && <span className={styles.trendDesc}>{trendDesc}</span>}
          </div>
        )}

      </div>
    </Card>
  )
}
