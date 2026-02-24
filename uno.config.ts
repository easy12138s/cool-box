import { defineConfig, presetUno, presetWebFonts, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'Fira Code'
      }
    })
  ],
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#10b981'
    }
  },
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer',
    'btn-primary': 'btn bg-primary text-white hover:bg-primary/80',
    'card': 'bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden'
  }
})
