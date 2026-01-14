import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ⚡ penting agar switcher tema berfungsi lewat class

  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './vendor/laravel/jetstream/**/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.vue',
    './resources/js/spa/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-[var(--color-light-bg)]',
    'dark:bg-[var(--color-dark-bg)]',
    'bg-[var(--color-card-light)]',
    'dark:bg-[var(--color-card-dark)]',
    'border-[var(--color-border-light)]',
    'dark:border-[var(--color-border-dark)]',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        dark: {
          DEFAULT: '#1e1f22', // latar utama dark
          light: '#2a2b32',   // elemen panel/kartu
        },
      },
      transitionProperty: {
        'color-bg': 'background-color, color',
      },
    },
  },

  plugins: [
    forms,
    typography,
  ],
}
