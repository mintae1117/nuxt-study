// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 전역 CSS (테마 토큰 + Tailwind). vue-study 의 테마를 그대로 포팅했다.
  css: ['~/assets/css/main.css'],

  // Tailwind v4 는 별도 Nuxt 모듈 없이 Vite 플러그인으로 붙인다.
  // (Nuxt 의 vite 설정에 플러그인을 그대로 끼워넣을 수 있다 = Nuxt 가 Vite 위에 있다는 증거)
  vite: {
    plugins: [tailwindcss()],
  },

  // useHead 의 기본값. 각 페이지에서 useSeoMeta 로 덮어쓴다.
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: 'Nuxt ↔ Vue 학습 노트',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Vue 를 아는 사람을 위한 Nuxt 비교 학습 가이드',
        },
      ],
    },
  },
})
