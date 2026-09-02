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
          bg: "#060b13",        // Deepest control room navy
          panel: "#0c1527",     // Main panel slate-navy
          header: "#0f1c34",    // Command top bar
          border: "#1e2d4a",    // Thin structured border
          borderLight: "#334155",
          card: "#111c33",      // Inner card container
          cardLight: "#162442",
          accent: "#0ea5e9",    // Active command cyan
          accentCyan: "#06b6d4",
          danger: "#ef4444",    // Active critical incident red
          warning: "#f59e0b",   // Caution alert amber
          success: "#10b981",   // Status safe emerald
          textMuted: "#94a3b8", // Slate body text
          textLight: "#f1f5f9"  // Crisp white heading
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      fontSize: {
        '4xs': '0.55rem',
        '3xs': '0.65rem',
        '2xs': '0.75rem',
      },
      boxShadow: {
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.45)',
        'glow-cyan': '0 0 15px rgba(14, 165, 233, 0.35)',
        'glow-amber': '0 0 15px rgba(245, 158, 11, 0.4)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.35)',
        'cmd': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(30, 45, 74, 0.7)'
      }
    },
  },
  plugins: [],
}
