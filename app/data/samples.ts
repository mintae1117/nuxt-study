// 각 토픽 페이지의 "Nuxt vs Vue(plain)" 코드 비교 샘플 모음.
// 별도 .ts 인 이유: 샘플에 </script> 가 그대로 들어가서 .vue 의 SFC 파서를 깨뜨리기 때문.

export const routing = {
  nuxt: `# Nuxt: 파일이 곧 라우트. 설정 파일이 없다.
app/pages/
├── index.vue          ->  /
├── about.vue          ->  /about
├── users/
│   ├── index.vue      ->  /users
│   └── [id].vue       ->  /users/:id        (동적)
└── blog/
    └── [...slug].vue  ->  /blog/*           (캐치올)

<!-- [id].vue 안에서 파라미터 읽기 -->
<script setup lang="ts">
const route = useRoute()        // 자동 임포트
const id = route.params.id
</script>`,

  vue: `// Vue(plain): vue-router 를 직접 설치·설정해야 한다.
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/about', component: () => import('./pages/About.vue') },
    { path: '/users', component: () => import('./pages/Users.vue') },
    { path: '/users/:id', component: () => import('./pages/User.vue') },
  ],
})
// main.ts 에서 app.use(router) 까지 직접 연결`,
  vueLang: 'ts',
}

export const autoImports = {
  nuxt: `<script setup lang="ts">
// import 가 한 줄도 없다. Nuxt 가 전부 자동 임포트한다:
//  - Vue API:  ref, computed, watch, onMounted ...
//  - composables: app/composables/* (useTheme 등)
//  - 컴포넌트:  app/components/* (<DemoBox /> 등)
//  - Nuxt 내장: useRoute, useFetch, useState, useHead ...
const count = ref(0)
const double = computed(() => count.value * 2)
const { isDark } = useTheme()       // 내가 만든 composable
</script>

<template>
  <DemoBox>{{ count }} / {{ double }}</DemoBox>  <!-- 자동 등록 -->
</template>`,

  vue: `<script setup lang="ts">
// 필요한 건 전부 직접 import 해야 한다.
import { ref, computed } from 'vue'
import DemoBox from '@/components/DemoBox.vue'
import { useTheme } from '@/composables/useTheme'

const count = ref(0)
const double = computed(() => count.value * 2)
const { isDark } = useTheme()
</script>

<template>
  <DemoBox>{{ count }} / {{ double }}</DemoBox>
</template>`,
}

export const layouts = {
  nuxt: `<!-- app/layouts/default.vue : 공통 껍데기 -->
<template>
  <div>
    <AppHeader />
    <slot />            <!-- 페이지가 여기로 들어온다 -->
  </div>
</template>

<!-- app/app.vue : 레이아웃 + 현재 페이지 -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<!-- 특정 페이지에서 다른 레이아웃 쓰기 -->
<script setup lang="ts">
definePageMeta({ layout: 'admin' })
</script>`,

  vue: `// Vue(plain): 레이아웃 개념이 없다. 직접 컴포넌트로 감싸거나
// 라우트 meta + 중첩 라우트로 흉내 낸다.
<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

// 또는 라우트별로 다른 레이아웃을 쓰려면
// 중첩 라우트(children) 구조를 손수 설계해야 한다.`,
  vueLang: 'vue',
}

export const dataFetching = {
  nuxt: `<script setup lang="ts">
// useFetch: SSR 에서 미리 데이터를 받아 HTML 에 심고,
// 클라이언트에서 재요청하지 않는다(하이드레이션). 중복 호출 방지·캐싱 내장.
const { data, pending, error, refresh } = await useFetch('/api/users')

// 더 세밀한 제어가 필요하면 useAsyncData + $fetch
const { data: user } = await useAsyncData(
  'user',
  () => $fetch('/api/users/1'),
)
</script>

<template>
  <p v-if="pending">로딩…</p>
  <ul v-else><li v-for="u in data" :key="u.id">{{ u.name }}</li></ul>
</template>`,

  vue: `<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Vue(plain): 로딩/에러/데이터 상태를 매번 직접 만든다.
const data = ref(null)
const pending = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/users')   // 별도 백엔드 필요
    data.value = await res.json()
  } catch (e) {
    error.value = e
  } finally {
    pending.value = false
  }
})
// SSR 없음 → 첫 화면엔 데이터가 비어 있다(CSR 후 채워짐)
</script>`,
}

export const rendering = {
  nuxt: `// nuxt.config.ts — 경로별로 렌더링 전략을 섞는다(하이브리드).
export default defineNuxtConfig({
  routeRules: {
    '/':            { prerender: true },   // SSG (빌드 시 정적 생성)
    '/blog/**':     { swr: 3600 },         // ISR/캐시 (1시간)
    '/admin/**':    { ssr: false },        // SPA (클라이언트 전용)
    '/api/**':      { cors: true },        // 서버 핸들러
  },
})

// 같은 앱 안에서 페이지마다 SSR/SSG/SPA 를 골라 쓸 수 있다.`,

  vue: `// Vue(plain) + Vite: 기본은 CSR(클라이언트 렌더링) 한 가지.
// index.html 의 빈 <div id="app"> 에 JS 로 그린다.
//
// <div id="app"></div>   ← 검색엔진/첫 페인트에는 빈 화면
//
// SSR/SSG 를 하려면 vite-ssr, @vitejs 플러그인 등을
// 직접 구성해야 하고, 사실상 그게 Nuxt 가 해주는 일이다.`,
  nuxtLang: 'ts',
  vueLang: 'ts',
}

export const seo = {
  nuxt: `<script setup lang="ts">
// useSeoMeta: 타입 안전한 메타 태그. SSR 이라 검색엔진이 바로 읽는다.
useSeoMeta({
  title: '사용자 목록',
  description: '등록된 모든 사용자',
  ogTitle: '사용자 목록',
  ogImage: '/og.png',
})

// 더 일반적인 head 제어는 useHead
useHead({
  htmlAttrs: { lang: 'ko' },
  link: [{ rel: 'canonical', href: 'https://site.com/users' }],
})
</script>`,

  vue: `<script setup lang="ts">
// Vue(plain): document.title 을 직접 만지거나
// @unhead/vue · @vueuse/head 같은 라이브러리를 설치해야 한다.
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '사용자 목록'   // CSR 이라 JS 실행 후에야 바뀜
})
// → 크롤러가 JS 실행 전에 보면 메타가 비어 있어 SEO 에 불리.`,
}

export const server = {
  nuxt: `// server/api/users.ts — 같은 프로젝트 안에 백엔드가 산다(Nitro 엔진).
export default defineEventHandler(async (event) => {
  const query = getQuery(event)         // ?page=2
  // DB 조회, 외부 API 호출 등 서버 로직
  return [{ id: 1, name: '민태' }]      // 자동 JSON 직렬화
})

// server/api/users/[id].ts — 동적 라우트도 동일
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return { id, name: 'user-' + id }
})

// 프론트에서: const { data } = await useFetch('/api/users')`,

  vue: `// Vue(plain): 프론트엔드 전용. 백엔드가 따로 필요하다.
// 예) 별도 Express 서버 프로젝트
import express from 'express'
const app = express()

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: '민태' }])
})
app.listen(4000)

// → 배포·포트·CORS 를 별도로 관리해야 한다.`,
  nuxtLang: 'ts',
  vueLang: 'ts',
}

export const state = {
  nuxt: `<script setup lang="ts">
// useState: SSR 안전한 전역 상태. key 로 식별하며,
// 서버에서 만든 값이 클라이언트로 직렬화되어 그대로 이어진다.
const count = useState('count', () => 0)   // 초기값은 함수로
const user = useState('user', () => null)

function inc() { count.value++ }
</script>

<template><button @click="inc">{{ count }}</button></template>`,

  vue: `// Vue(plain) SPA 라면 모듈 스코프 ref 싱글톤으로 전역 상태를 만들 수 있다.
import { ref } from 'vue'
export const count = ref(0)     // import 하는 모든 곳이 공유

// ★ 하지만 SSR 에서는 위험하다:
// 모듈은 서버에서 '한 번' 평가되어 모든 요청이 같은 ref 를 공유한다
// → A 사용자의 상태가 B 사용자에게 새어 나가는 cross-request 오염.
// Nuxt 의 useState 는 요청마다 격리되어 이 문제가 없다.`,
  vueLang: 'ts',
}
