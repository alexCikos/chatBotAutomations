/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './src/app.html'
  ],
  theme: {
    extend: {
      // Custom Colors using CSS variables
      colors: {
        // Primary backgrounds
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)', 
        'bg-tertiary': 'var(--bg-tertiary)',
        
        // Surface colors
        'surface': {
          'default': 'var(--surface-default)',
          'elevated': 'var(--surface-elevated)',
          'interactive': 'var(--surface-interactive)',
        },
        
        // Text colors
        'text': {
          'primary': 'var(--text-primary)',
          'secondary': 'var(--text-secondary)',
          'muted': 'var(--text-muted)',
          'disabled': 'var(--text-disabled)',
          'inverse': 'var(--text-inverse)',
        },
        
        // Border colors
        'border': {
          'primary': 'var(--border-primary)',
          'secondary': 'var(--border-secondary)',
          'muted': 'var(--border-muted)',
        },
        
        // Interactive states
        'state': {
          'hover': 'var(--state-hover)',
          'hover-light': 'var(--state-hover-light)',
          'focus': 'var(--state-focus)',
          'active': 'var(--state-active)',
        },
        
        // Semantic colors
        'danger': {
          'DEFAULT': 'var(--color-danger)',
          'hover': 'var(--color-danger-hover)',
          'text': 'var(--color-danger-text)',
        },
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'info': 'var(--color-info)',
      },
      
      // Custom spacing scale
      spacing: {
        '0.5': 'var(--space-0-5)',
        '1.5': 'var(--space-1-5)',
        '2.5': 'var(--space-2-5)',
        '3.5': 'var(--space-3-5)',
        '7': 'var(--space-7)',
        '18': '4.5rem',
        '84': '21rem',
        '96': '24rem',
      },
      
      // Custom font family
      fontFamily: {
        'mono': 'var(--font-mono)',
      },
      
      // Custom font sizes
      fontSize: {
        'xs': ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        'sm': ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        'base': ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        'lg': ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],
        'xl': ['var(--text-xl)', { lineHeight: 'var(--leading-tight)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-none)' }],
        '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-none)' }],
      },
      
      // Custom font weights
      fontWeight: {
        'normal': 'var(--font-normal)',
        'medium': 'var(--font-medium)',
        'semibold': 'var(--font-semibold)',
        'bold': 'var(--font-bold)',
      },
      
      // Custom line heights
      lineHeight: {
        'none': 'var(--leading-none)',
        'tight': 'var(--leading-tight)',
        'snug': 'var(--leading-snug)',
        'normal': 'var(--leading-normal)',
        'relaxed': 'var(--leading-relaxed)',
        'loose': 'var(--leading-loose)',
      },
      
      // Custom border radius
      borderRadius: {
        'none': 'var(--radius-none)',
        'sm': 'var(--radius-sm)',
        'DEFAULT': 'var(--radius-default)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        'full': 'var(--radius-full)',
      },
      
      // Custom shadows
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-default)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'inner': 'var(--shadow-inner)',
        'modal': 'var(--shadow-modal)',
        'dropdown': 'var(--shadow-dropdown)',
        'card': 'var(--shadow-card)',
        'button': 'var(--shadow-button)',
      },
      
      // Custom transitions
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      
      // Custom transition utilities
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      
      // Custom breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      // Custom max widths
      maxWidth: {
        'chat': 'var(--width-chat-bubble)',
        'modal': 'var(--width-modal)',
        'input': 'var(--width-input)',
      },
      
      // Custom heights
      height: {
        'navbar': 'var(--height-navbar)',
        'main': 'var(--height-main)',
        'screen-dvh': 'var(--height-full)',
      },
      
      // Custom widths
      width: {
        'sidebar': 'var(--width-sidebar)',
        'content': 'var(--width-content)',
      },
      
      // Custom z-index
      zIndex: {
        'base': 'var(--z-base)',
        'dropdown': 'var(--z-dropdown)',
        'sticky': 'var(--z-sticky)',
        'fixed': 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'tooltip': 'var(--z-tooltip)',
        'toast': 'var(--z-toast)',
        'max': 'var(--z-max)',
      },
      
      // Custom gap sizes
      gap: {
        'xs': 'var(--gap-xs)',
        'sm': 'var(--gap-sm)',
        'md': 'var(--gap-md)',
        'lg': 'var(--gap-lg)',
        'xl': 'var(--gap-xl)',
      },
      
      // Custom icon sizes
      size: {
        'icon-xs': 'var(--size-icon-xs)',
        'icon-sm': 'var(--size-icon-sm)',
        'icon-md': 'var(--size-icon-md)',
        'icon-lg': 'var(--size-icon-lg)',
        'icon-xl': 'var(--size-icon-xl)',
      },
    },
  },
  plugins: [],
};