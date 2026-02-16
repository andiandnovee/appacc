module.exports = {
  content: [
    './resources/**/*.blade.php',
    './resources/spa/**/*.{js,ts,vue,jsx,tsx,html}',
    './index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
};