/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surveillance: {
          bg: "#080c14",        // Deepest command room navy
          panel: "#0f1626",     // Main panel gray-navy
          header: "#141c2f",    // Top bar
          border: "#1f293d",    // Glow border navy
          accent: "#0ea5e9",    // Active surveillance cyan
          danger: "#ef4444",    // Active incident red
          warning: "#f59e0b",   // Caution alert orange
          success: "#10b981",   // Status safe green
          textMuted: "#94a3b8"  // Slate text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.4)',
        'glow-cyan': '0 0 15px rgba(14, 165, 233, 0.4)',
        'glow-amber': '0 0 15px rgba(245, 158, 11, 0.4)',
      }
    },
  },
  plugins: [],
}
