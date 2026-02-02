import vue from '@vitejs/plugin-vue'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [],
  css: ['~/assets/css/main.css'],
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || 'default_secret_change_me',
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: `${process.env.APP_NAME}<${process.env.SMTP_FROM}>`,
  },

  // @ts-ignore
  nitro: {
    rollupConfig: {
      plugins: [vue()]
    }
  }
})
