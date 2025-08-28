// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl: 'var(--radius)'
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1f2937',
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            },
            'h1,h2,h3': {
              lineHeight: '1.2',
              scrollMarginTop: '6rem'
            },
            h2: { marginTop: '2.25rem', marginBottom: '0.75rem' },
            h3: { marginTop: '1.75rem', marginBottom: '0.5rem' },
            hr: { borderColor: 'rgba(0,0,0,0.06)', marginTop: '2rem', marginBottom: '2rem' }
          }
        }
      }
    }
  },
} satisfies Config;
