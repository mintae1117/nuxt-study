// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // 11번 토픽(Next.js 이주 가이드) 라이브 데모용 런타임 설정.
  // public 값은 클라이언트에 노출되며, 배포 환경에서 NUXT_PUBLIC_APP_VERSION
  // 환경변수로 '재빌드 없이' 덮어쓸 수 있다 (NEXT_PUBLIC_* 빌드 인라인과의 차이점).
  runtimeConfig: {
    public: {
      appVersion: "1.0.0",
    },
  },

  // 전역 CSS (테마 토큰 + Tailwind). vue-study 의 테마를 그대로 포팅했다.
  css: ["~/assets/css/main.css"],

  // Tailwind v4 는 별도 Nuxt 모듈 없이 Vite 플러그인으로 붙인다.
  // (Nuxt 의 vite 설정에 플러그인을 그대로 끼워넣을 수 있다 = Nuxt 가 Vite 위에 있다는 증거)
  vite: {
    plugins: [tailwindcss()],
  },

  // useHead 의 기본값. 각 페이지에서 useSeoMeta 로 덮어쓴다.
  app: {
    head: {
      htmlAttrs: { lang: "ko" },
      title: "Nuxt ↔ Vue 학습 노트",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Vue 를 아는 사람을 위한 Nuxt 비교 학습 가이드",
        },
      ],
      // ★ FOUC(다크모드 깜빡임) 방지용 무-플래시 스크립트.
      // SSR 은 사용자의 테마(localStorage)를 모르므로 라이트로 그려 보낸다.
      // 이 동기 인라인 스크립트를 <head> 에 두면 브라우저가 body 를 페인트하기 '전에'
      // 실행되어 <html>.dark 를 미리 붙인다 → 첫 페인트부터 올바른 테마라 깜빡임이 없다.
      // (useTheme.ts 의 STORAGE_KEY / 판정 로직과 반드시 동일하게 유지할 것)
      script: [
        {
          tagPosition: "head",
          innerHTML: `(function(){try{var m=localStorage.getItem('nuxt-study-theme')||'system';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
        },
      ],
    },
  },
});
