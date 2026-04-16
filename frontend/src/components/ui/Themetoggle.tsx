import { FC, ReactNode, ReactElement, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import styles from './Themetoggle.module.css'

interface ThemeToggleProps {
  // Props here
}


export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
    //    ↑ lazy init — hanya baca localStorage sekali saat mount
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <button
      className={styles.btn}
      onClick={() => setDarkMode(v => !v)}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}