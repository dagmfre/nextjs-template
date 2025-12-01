import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Safelist critical classes that use CSS variables or dynamic values
  safelist: [
    // Telegram theme colors
    'bg-tg-bg', 'bg-tg-secondary', 'text-tg-text', 'text-tg-hint', 'text-tg-link',
    'bg-tg-button', 'text-tg-button-text', 'border-tg-hint',
    // Gaming colors with opacity variants
    'bg-gaming-purple', 'bg-gaming-pink', 'bg-gaming-blue', 'bg-gaming-cyan',
    'text-gaming-purple', 'text-gaming-pink', 'text-gaming-blue', 'text-gaming-cyan',
    'from-gaming-purple', 'to-gaming-pink', 'via-gaming-pink',
    // Gaming colors with opacity
    'bg-gaming-purple/30', 'bg-gaming-purple/40', 'bg-gaming-pink/30',
    'from-gaming-purple/40', 'via-gaming-pink/30', 'to-gaming-blue/20',
    // Accent colors
    'bg-accent', 'text-accent', 'bg-accent-light', 'bg-accent-dark',
    // Gradients
    'bg-gradient-gaming', 'bg-gradient-card',
    // Animations
    'animate-fade-in', 'animate-slide-up', 'animate-pulse-slow',
  ],
  theme: {
    extend: {
      colors: {
        // Telegram theme colors (CSS variable based)
        'tg-bg': 'var(--tg-theme-bg-color, #1a1a2e)',
        'tg-secondary': 'var(--tg-theme-secondary-bg-color, #16213e)',
        'tg-text': 'var(--tg-theme-text-color, #ffffff)',
        'tg-hint': 'var(--tg-theme-hint-color, #999999)',
        'tg-link': 'var(--tg-theme-link-color, #3390ec)',
        'tg-button': 'var(--tg-theme-button-color, #3390ec)',
        'tg-button-text': 'var(--tg-theme-button-text-color, #ffffff)',
        // Gaming platform accent colors
        'accent': {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        // Flat gaming colors for proper Tailwind class generation
        'gaming-purple': '#9333EA',
        'gaming-pink': '#EC4899',
        'gaming-blue': '#3B82F6',
        'gaming-cyan': '#06B6D4',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-gaming": "linear-gradient(135deg, #9333EA 0%, #EC4899 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      spacing: {
        'safe-top': 'var(--tg-content-safe-area-inset-top, 0px)',
        'safe-bottom': 'var(--tg-content-safe-area-inset-bottom, 0px)',
        'safe-left': 'var(--tg-content-safe-area-inset-left, 0px)',
        'safe-right': 'var(--tg-content-safe-area-inset-right, 0px)',
      },
    },
  },
  plugins: [],
};
export default config;
