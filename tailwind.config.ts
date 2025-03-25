import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          blue: 'rgb(var(--primary-blue) / <alpha-value>)',
          purple: 'rgb(var(--primary-purple) / <alpha-value>)',
        },
        accent: {
          blue: 'rgb(var(--accent-blue) / <alpha-value>)',
          purple: 'rgb(var(--accent-purple) / <alpha-value>)',
        },
        success: 'rgb(var(--success-green) / <alpha-value>)',
        warning: 'rgb(var(--warning-yellow) / <alpha-value>)',
        error: 'rgb(var(--error-red) / <alpha-value>)',
        gray: {
          50: 'rgb(var(--neutral-50) / <alpha-value>)',
          100: 'rgb(var(--neutral-100) / <alpha-value>)',
          200: 'rgb(var(--neutral-200) / <alpha-value>)',
          300: 'rgb(var(--neutral-300) / <alpha-value>)',
          400: 'rgb(var(--neutral-400) / <alpha-value>)',
          500: 'rgb(var(--neutral-500) / <alpha-value>)',
          600: 'rgb(var(--neutral-600) / <alpha-value>)',
          700: 'rgb(var(--neutral-700) / <alpha-value>)',
          800: 'rgb(var(--neutral-800) / <alpha-value>)',
          900: 'rgb(var(--neutral-900) / <alpha-value>)',
          950: 'rgb(var(--neutral-950) / <alpha-value>)',
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-shine": "linear-gradient(45deg, transparent 25%, rgba(255, 255, 255, 0.05) 50%, transparent 75%)",
      },
      fontFamily: {
        sans: ['ReplicaLL'],
        mono: ['ReplicaLLMono'],
      },
      animation: {
        'slide-in': 'slideInRight 0.5s forwards',
        'slide-out': 'slideOutRight 0.5s forwards',
        'fade-in': 'fadeIn 0.5s forwards',
        'fade-in-up': 'fadeInUp 0.7s forwards',
        'pulse': 'pulse 2s infinite',
        'typing': 'typing 1s infinite',
        'glow-pulse': 'glowPulse 2s infinite',
        'gradient-flow': 'gradient-flow 8s ease infinite',
        'float-particle': 'float-particle 8s ease infinite',
        'grid-scroll': 'grid-scroll 10s linear infinite',
        'ambient-glow': 'ambient-glow 4s ease infinite',
        'voice-wave': 'voice-wave 1.5s ease-in-out infinite',
        'section-reveal': 'section-reveal 0.8s ease forwards',
        'loading-bar': 'loading-bar 3s ease-in-out forwards',
      },
      keyframes: {
        slideInRight: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          'from': { transform: 'translateX(0)', opacity: '1' },
          'to': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px 5px rgba(56, 139, 255, 0.15)',
        'glow-purple': '0 0 15px 5px rgba(121, 40, 202, 0.15)',
        'glow-accent': '0 0 15px 5px rgba(10, 217, 255, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
