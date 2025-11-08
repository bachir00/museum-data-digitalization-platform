/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Thème musée africain
        museum: {
          black: '#0F0F0F',      // Noir profond
          charcoal: '#1A1A1A',   // Charbon
          gold: '#D4AF37',       // Or élégant
          lightgold: '#F4E4BC',  // Or clair
          beige: '#F5F5DC',      // Beige chaud
          cream: '#FDF6E3',      // Crème
          terracotta: '#C65D32', // Terre cuite
          ochre: '#CC7722',      // Ocre
          bronze: '#CD7F32',     // Bronze
          ivory: '#FFFFF0',      // Ivoire
        },
        // Gradients
        gradient: {
          museum: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)',
          gold: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 100%)',
          warm: 'linear-gradient(135deg, #C65D32 0%, #CC7722 100%)',
        }
      },
      fontFamily: {
        'heading': ['Lora', 'serif'],
        'body': ['Poppins', 'sans-serif'],
        'elegant': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'museum-gradient': 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 100%)',
        'warm-gradient': 'linear-gradient(135deg, #C65D32 0%, #CC7722 100%)',
        'overlay-dark': 'linear-gradient(to bottom, rgba(15,15,15,0.7), rgba(26,26,26,0.9))',
        'overlay-gold': 'linear-gradient(to bottom, rgba(212,175,55,0.1), rgba(244,228,188,0.3))',
      },
      boxShadow: {
        'museum': '0 10px 25px rgba(0, 0, 0, 0.2)',
        'museum-hover': '0 20px 40px rgba(0, 0, 0, 0.3)',
        'gold': '0 8px 20px rgba(212, 175, 55, 0.3)',
        'gold-hover': '0 12px 30px rgba(212, 175, 55, 0.4)',
        'elegant': '0 4px 15px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}