import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Carousel.module.css'

/**
 * Carousel
 *
 * Props:
 * - slides      → array of { src, alt?, title?, description? }
 * - height      → CSS height (default: '360px')
 * - autoPlay    → boolean (default: false)
 * - interval    → ms autoplay interval (default: 3000)
 * - showDots    → boolean (default: true)
 * - showArrows  → boolean (default: true)
 * - loop        → boolean (default: true)
 */
export default function Carousel({
  slides = [],
  height = '360px',
  autoPlay = false,
  interval = 3000,
  showDots = true,
  showArrows = true,
  loop = true,
}) {
  const [current, setCurrent] = useState(0)
  const total = slides.length

  const prev = useCallback(() => {
    setCurrent(c => loop ? (c - 1 + total) % total : Math.max(0, c - 1))
  }, [loop, total])

  const next = useCallback(() => {
    setCurrent(c => loop ? (c + 1) % total : Math.min(total - 1, c + 1))
  }, [loop, total])

  // Autoplay
  useEffect(() => {
    if (!autoPlay) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [autoPlay, interval, next])

  if (!slides.length) return null

  const slide = slides[current]

  return (
    <div className={styles.wrapper} style={{ height }}>

      {/* Track */}
      <div
        className={styles.track}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className={styles.slide} style={{ height }}>
            <img src={s.src} alt={s.alt ?? `Slide ${i + 1}`} />
          </div>
        ))}
      </div>

      {/* Caption */}
      {(slide.title || slide.description) && (
        <div className={styles.caption}>
          {slide.title       && <p className={styles.captionTitle}>{slide.title}</p>}
          {slide.description && <p className={styles.captionDesc}>{slide.description}</p>}
        </div>
      )}

      {/* Arrows */}
      {showArrows && total > 1 && (
        <>
          <button
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={prev}
            disabled={!loop && current === 0}
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className={`${styles.nav} ${styles.navNext}`}
            onClick={next}
            disabled={!loop && current === total - 1}
            aria-label="Slide berikutnya"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && total > 1 && (
        <div className={styles.dots} role="tablist">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  )
}
