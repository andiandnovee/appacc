import styles from './Avatar.module.css'

const SIZE_PX = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 }

/**
 * Avatar
 * - src      → URL gambar
 * - alt      → alt text
 * - name     → nama (untuk inisial fallback)
 * - size     → 'xs'|'sm'|'md'|'lg'|'xl' (default: 'md')
 * - status   → 'online'|'away'|'busy'|'offline'
 */
export function Avatar({ src, alt, name, size = 'md', status }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.avatar} ${styles[size]}`} title={name}>
        {src
          ? <img src={src} alt={alt ?? name} className={styles.img} />
          : initials
        }
      </div>
      {status && (
        <span className={`${styles.status} ${styles[status]}`} aria-label={status} />
      )}
    </div>
  )
}

/**
 * AvatarGroup
 * - avatars  → array of Avatar props
 * - max      → max avatar ditampilkan (default: 4)
 * - size     → size untuk semua avatar
 */
export function AvatarGroup({ avatars = [], max = 4, size = 'md' }) {
  const visible  = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <div className={styles.group}>
      {overflow > 0 && (
        <div
          className={`${styles.overflow} ${styles[size]}`}
          style={{ width: SIZE_PX[size], height: SIZE_PX[size] }}
          title={`${overflow} lainnya`}
        >
          +{overflow}
        </div>
      )}
      {[...visible].reverse().map((av, i) => (
        <Avatar key={i} {...av} size={size} />
      ))}
    </div>
  )
}

export default Avatar
