/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "index.html",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'color-primary': '#93D5E1',
        'color-secundary': '#37393a',
        'alabasters': '#FAFAFA',
        'mercury': '#e2e2e2',
        'mine-shaft': '#212121',
        'mine-shaft2': '#333333',
        'tundora': '#4E4E4E',
        'vulcan': '#101322',
      }
    },
  },
  plugins: [],
}

