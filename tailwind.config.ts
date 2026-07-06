import tailwindcssAnimate from 'tailwindcss-animate'

const config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        amber: {
          50: 'hsl(22 90% 95%)',
          100: 'hsl(22 85% 88%)',
          200: 'hsl(22 88% 78%)',
          300: 'hsl(22 90% 65%)',
          400: 'hsl(22 95% 58%)',
          500: 'hsl(22 95% 53%)',
          600: 'hsl(18 90% 45%)',
          700: 'hsl(15 80% 38%)',
          800: 'hsl(12 65% 28%)',
          900: 'hsl(10 55% 16%)',
        },
        indigo: {
          50: 'hsl(20 8% 95%)',
          100: 'hsl(20 6% 88%)',
          200: 'hsl(20 7% 80%)',
          300: 'hsl(20 6% 70%)',
          400: 'hsl(20 5% 55%)',
          500: 'hsl(20 5% 42%)',
          600: 'hsl(20 5% 32%)',
          700: 'hsl(20 5% 24%)',
          800: 'hsl(20 5% 16%)',
          900: 'hsl(20 5% 10%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
        'slide-in-from-top': { from: { transform: 'translateY(-100%)' }, to: { transform: 'translateY(0)' } },
        'slide-in-from-bottom': { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        'eq-drift': {
          '0%': { transform: 'translate(0px, 0px) rotate(0deg) scale(1)' },
          '25%': { transform: 'translate(30px, -20px) rotate(2deg) scale(1.03)' },
          '50%': { transform: 'translate(-15px, -35px) rotate(-1.5deg) scale(0.98)' },
          '75%': { transform: 'translate(-25px, -10px) rotate(1deg) scale(1.02)' },
          '100%': { transform: 'translate(0px, 0px) rotate(0deg) scale(1)' },
        },
        'eq-sway': {
          '0%': { transform: 'translateX(0px) translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateX(25px) translateY(-15px) rotate(1.5deg)' },
          '50%': { transform: 'translateX(-10px) translateY(-25px) rotate(-1deg)' },
          '75%': { transform: 'translateX(-20px) translateY(-8px) rotate(0.5deg)' },
          '100%': { transform: 'translateX(0px) translateY(0px) rotate(0deg)' },
        },
        'eq-rise': {
          '0%': { transform: 'translateY(0px) scale(1)', opacity: '0.08' },
          '25%': { transform: 'translateY(-30px) scale(1.02)', opacity: '0.14' },
          '50%': { transform: 'translateY(-50px) scale(1.04)', opacity: '0.1' },
          '75%': { transform: 'translateY(-25px) scale(1.01)', opacity: '0.13' },
          '100%': { transform: 'translateY(0px) scale(1)', opacity: '0.08' },
        },
        'eq-float': {
          '0%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) translateX(10px) rotate(-1.5deg)' },
          '50%': { transform: 'translateY(-8px) translateX(-8px) rotate(1deg)' },
          '75%': { transform: 'translateY(-28px) translateX(5px) rotate(-0.5deg)' },
          '100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
        },
        'spin-slow': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'spin-slower': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(-360deg)' } },
        'pulse-glow': { '0%, 100%': { opacity: '0.2', transform: 'scale(1)' }, '50%': { opacity: '0.5', transform: 'scale(1.1)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'eq-drift': 'eq-drift 18s ease-in-out infinite',
        'eq-sway': 'eq-sway 16s ease-in-out infinite',
        'eq-rise': 'eq-rise 20s ease-in-out infinite',
        'eq-float': 'eq-float 15s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-slower': 'spin-slower 25s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
