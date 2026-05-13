/**
 * Tailwind configuration.
 *
 * Purpose:
 * - Tells Tailwind where to scan for class names.
 * - Keeps the generated CSS scoped to the app files in index.html and src/.
 */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {}
  },
  plugins: []
}
