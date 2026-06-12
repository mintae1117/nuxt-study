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

  options: `// useFetch 실전 옵션 — Next.js 의 캐시/로딩 패턴이 옵션으로 들어와 있다
const { data, status, error } = await useFetch('/api/users', {
  lazy: true,        // 내비게이션을 막지 않음 (= loading.tsx 시나리오)
  server: false,     // 클라이언트에서만 호출 (= 'use client' + useEffect)
  pick: ['id', 'name'],            // SSR 페이로드 다이어트
  transform: (users) => users.slice(0, 10),
  watch: [page],     // 이 ref 가 바뀌면 자동 재요청
})

// 변이(mutation)는 $fetch — Server Actions 대신 그냥 API 호출
await $fetch('/api/users', {
  method: 'POST',
  body: { name: '민태' },
})`,

  next: `// Next.js App Router — 서버 컴포넌트에서 fetch
export default async function UsersPage() {
  const res = await fetch('https://api.site.com/users', {
    next: { revalidate: 3600 },    // 캐시/ISR 제어
  })
  const users = await res.json()
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
}
// 단, 이 컴포넌트에선 useState/onClick 불가(서버 컴포넌트).
// 인터랙션이 필요하면 'use client' 자식으로 분리해야 한다.
// 변이는 Server Action('use server') 을 따로 만든다.
// → Nuxt 는 이 분리 자체가 없다. 같은 컴포넌트에서 페칭+인터랙션.`,
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

  reactive: `// Nuxt — 데이터 기반 메타도 컴포넌트 안에서. getter 를 주면 반응형
const { data: user } = await useFetch(\`/api/users/\${id}\`)

useSeoMeta({
  title: () => user.value?.name ?? '로딩 중',  // 값 바뀌면 자동 갱신
  ogImage: () => user.value?.avatar,
})

useHead({ titleTemplate: '%s · Nuxt 학습' })   // 모든 페이지 공통 접미사`,

  nextMeta: `// Next.js — 정적이면 metadata 객체, 동적이면 generateMetadata 함수
export const metadata = { title: '사용자 목록' }

// 동적: 페이지 렌더와 별도로 한 번 더 데이터를 만져야 한다
export async function generateMetadata({ params }) {
  const user = await getUser(params.id)
  return { title: user.name, openGraph: { images: [user.avatar] } }
}
// 서버 컴포넌트에서만 가능 — 'use client' 페이지에선 못 쓴다`,
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

  rest: `// 파일명 '접미사'가 HTTP 메서드가 된다
server/api/users.get.ts          →  GET    /api/users
server/api/users.post.ts         →  POST   /api/users
server/api/users/[id].delete.ts  →  DELETE /api/users/:id

// users.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)        // POST body 파싱
  if (!body.name) {
    throw createError({ statusCode: 400, statusMessage: 'name 필수' })
  }
  setResponseStatus(event, 201)
  return { id: 4, ...body }                 // 자동 JSON 직렬화
})`,

  nextRoute: `// Next.js — app/api/users/route.ts 안에서 '함수명'으로 분기
export async function GET(request: Request) {
  return Response.json([{ id: 1, name: '민태' }])
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.name) {
    return Response.json({ error: 'name 필수' }, { status: 400 })
  }
  return Response.json({ id: 4, ...body }, { status: 201 })
}
// 동적 세그먼트는 app/api/users/[id]/route.ts 폴더로`,
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

// ── 09 하이드레이션 & 클라이언트 코드 (vs Next.js) ──────────────────────────

export const hydration = {
  universal: `<script setup lang="ts">
// Nuxt: 지시어가 없다. 모든 컴포넌트가 universal —
//  ① 서버에서 실행되어 HTML 을 만들고 (SSR)
//  ② 브라우저에서 다시 실행되어 이벤트를 붙인다 (하이드레이션)
// "서버 컴포넌트 / 클라 컴포넌트" 라는 경계 자체가 없다.
const count = ref(0)
const { data } = await useFetch('/api/users')   // 페칭도 같은 파일에서
</script>

<template>
  <button @click="count++">{{ count }}</button>  <!-- 인터랙션도 OK -->
</template>`,

  useClient: `'use client'
// ↑ Next.js App Router: RSC 가 기본이라 useState/onClick 을 쓰려면
//   이 지시어로 "클라이언트 컴포넌트" 경계를 선언해야 한다.
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
// 데이터 페칭(서버 컴포넌트)과 인터랙션(클라 컴포넌트)을
// 컴포넌트 단위로 쪼개야 했던 일이 Nuxt 에선 사라진다.
// (RSC 비슷한 것이 필요하면 실험 기능 <NuxtIsland> 가 있긴 하다)`,

  clientOnly: `<template>
  <!-- SSR 에서 그릴 수 없는 것(차트, 지도, window 의존)을 감싼다 -->
  <ClientOnly>
    <HeavyChart />
    <template #fallback>
      <p>차트 로딩 중…</p>   <!-- SSR HTML 에 들어갈 자리표시자 -->
    </template>
  </ClientOnly>
</template>

<!-- 또는 파일명으로: HeavyChart.client.vue → 자동으로 클라 전용 -->`,

  dynamicSsrFalse: `import dynamic from 'next/dynamic'

// Next.js: dynamic import + ssr:false 로 클라이언트 전용 컴포넌트
const HeavyChart = dynamic(
  () => import('./HeavyChart'),
  {
    ssr: false,
    loading: () => <p>차트 로딩 중…</p>,
  },
)`,

  windowGuard: `// 서버에는 window / localStorage / document 가 없다 — SSR 중 터진다
const w = window.innerWidth            // ❌ 서버에서 ReferenceError

// ✅ 방법 1: onMounted (클라이언트에서만 실행됨)
onMounted(() => { width.value = window.innerWidth })

// ✅ 방법 2: import.meta.client 가드 (서버 번들에선 데드코드 제거)
if (import.meta.client) {
  width.value = window.innerWidth
}

// 하이드레이션 불일치도 같은 뿌리의 문제다:
// new Date() / Math.random() / localStorage 값을 바로 렌더하면
// 서버 HTML ≠ 클라 첫 렌더 → "Hydration mismatch" 경고 + 화면 덜컥.
// → onMounted 후에 채우거나 <ClientOnly> 로 감싼다.`,

  windowGuardNext: `// Next.js 에서 겪던 것과 정확히 같은 문제, 같은 해법이다
const w = window.innerWidth            // ❌ 서버에서 터짐

// useEffect = onMounted 대응
useEffect(() => { setWidth(window.innerWidth) }, [])

// typeof 가드
if (typeof window !== 'undefined') { /* ... */ }

// "Text content does not match server-rendered HTML" 경고도
// Nuxt 의 Hydration mismatch 와 같은 것.
// 멘탈 모델 이동: 'use client' 를 붙이는 대신,
// "이 코드가 서버에서도 도는가?" 를 스스로 가드한다.`,
}

// ── 10 미들웨어 & 에러 처리 (vs Next.js) ────────────────────────────────────

export const middlewareError = {
  routeMw: `// app/middleware/auth.ts — 라우트 미들웨어 (페이지 이동마다 실행)
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useState('user')
  if (!user.value) {
    return navigateTo('/login')      // 리다이렉트 (서버/클라 모두 동작)
    // return abortNavigation()      // 또는 이동 자체를 차단
  }
})

// 적용은 페이지에서 선언 — 여러 개도 가능
definePageMeta({ middleware: ['auth'] })

// 모든 라우트에 적용하려면 파일명을 auth.global.ts 로`,

  nextMw: `// Next.js — middleware.ts (프로젝트 루트에 단 1개, Edge 런타임)
import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// 적용 범위는 matcher 패턴으로 지정
export const config = { matcher: ['/admin/:path*'] }

// → Nuxt 는 미들웨어가 '여러 개 + 라우터 레벨'이라
//   페이지별 조합이 자유롭다 (Edge 제약도 없음)`,

  errorPage: `<!-- app/error.vue — 앱 전체 에러 페이지 (단 하나) -->
<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; statusMessage?: string }
}>()
// 복구: clearError({ redirect: '/' })
</script>

<template>
  <h1 v-if="error.statusCode === 404">없는 페이지입니다</h1>
  <h1 v-else>문제가 발생했습니다</h1>
</template>

<!-- 어디서든(페이지/미들웨어/server api) 던지면 여기로 온다 -->
throw createError({ statusCode: 404, statusMessage: 'User not found' })`,

  nextError: `// Next.js — 폴더마다 error.tsx / not-found.tsx 를 둔다
'use client'        // error.tsx 는 클라 컴포넌트 강제
export default function Error({ error, reset }) {
  return (
    <div>
      <p>문제가 발생했습니다</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  )
}

// 404 는 별도 파일 + 함수
import { notFound } from 'next/navigation'
if (!user) notFound()      // → not-found.tsx 렌더`,
}

// ── 11 Next.js → Nuxt 이주 가이드 ───────────────────────────────────────────

export const nextjs = {
  env: `// nuxt.config.ts — runtimeConfig (빌드 후에도 env 로 교체 가능)
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '',              // 서버 전용. NUXT_API_SECRET 로 주입
    public: {
      appVersion: '1.0.0',      // 클라 노출. NUXT_PUBLIC_APP_VERSION
    },
  },
})

// 어디서든
const config = useRuntimeConfig()
config.public.appVersion        // 클라/서버 OK
config.apiSecret                // server/ 안에서만 보임`,

  envNext: `// Next.js — process.env + 접두사 규약
process.env.API_SECRET                 // 서버 전용
process.env.NEXT_PUBLIC_APP_VERSION    // 클라 노출

// ⚠️ NEXT_PUBLIC_* 은 '빌드 타임'에 번들로 인라인된다.
//    환경(스테이징/프로덕션)마다 다시 빌드해야 한다.
// Nuxt 의 runtimeConfig 는 이름 그대로 '런타임'에 읽으므로
// 같은 빌드 산출물을 env 만 바꿔 어디든 띄울 수 있다.`,

  plugins: `// app/plugins/analytics.client.ts — 앱 시작 시 1회 실행
export default defineNuxtPlugin((nuxtApp) => {
  // .client.ts 접미사 = 클라이언트에서만 (.server.ts 도 있음)
  nuxtApp.vueApp.use(SomeVuePlugin)        // Vue 플러그인 등록
  return {
    provide: { track: (ev: string) => {/* ... */} },
  }
})

// 사용처: const { $track } = useNuxtApp()
// 확장은 모듈 생태계로: @nuxt/image, @nuxtjs/i18n, @pinia/nuxt ...`,

  pluginsNext: `// Next.js 라면 — Provider 트리를 루트 레이아웃에 쌓는다
// app/providers.tsx
'use client'
export function Providers({ children }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={qc}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}

// app/layout.tsx
<Providers>{children}</Providers>`,
}
