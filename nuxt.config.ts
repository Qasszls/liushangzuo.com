import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-02-19',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  colorMode: {
    classSuffix: '',
  },

  googleFonts: {
    families: {
      'Noto Serif SC': [400, 600, 700],
      'LXGW WenKai': [400, 700],
    },
    display: 'swap',
    download: true,
  },

  content: {},

  image: {
    quality: 80,
    format: ['webp', 'jpg', 'png'],
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'zh-CN' },
    },
  },

  typescript: {
    strict: true,
  },
})
