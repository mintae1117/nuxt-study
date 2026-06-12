<script setup lang="ts">
import { nextjs as s } from '~/data/samples'

useSeoMeta({
  title: 'Next.js → Nuxt 이주 가이드 · Nuxt 학습',
  description: 'App Router 규약 ↔ Nuxt 규약 총정리 대응표',
})

// 라이브 데모: nuxt.config.ts 의 runtimeConfig.public 값을 읽는다.
const config = useRuntimeConfig()

const mapping: { next: string; nuxt: string }[] = [
  { next: 'app/page.tsx', nuxt: 'app/pages/index.vue' },
  { next: 'app/users/[id]/page.tsx', nuxt: 'app/pages/users/[id].vue' },
  { next: 'layout.tsx (폴더마다 중첩)', nuxt: 'app/layouts/ + definePageMeta (평면)' },
  { next: 'loading.tsx', nuxt: "useFetch 의 lazy + status (전용 파일 없음)" },
  { next: 'error.tsx / not-found.tsx', nuxt: 'app/error.vue + createError()' },
  { next: 'middleware.ts (전역 1개)', nuxt: 'app/middleware/*.ts (여러 개)' },
  { next: 'app/api/**/route.ts (GET/POST export)', nuxt: 'server/api/*.get.ts (파일명 접미사)' },
  { next: "'use client' / RSC 경계", nuxt: '없음 — 전부 universal (+ <ClientOnly>)' },
  { next: 'Server Actions', nuxt: 'server/api + $fetch POST' },
  { next: "dynamic(() => import, { ssr: false })", nuxt: '<ClientOnly> / *.client.vue' },
  { next: '<Link> (뷰포트 prefetch)', nuxt: '<NuxtLink> (동일하게 prefetch)' },
  { next: '<Image> (next/image)', nuxt: '<NuxtImg> (@nuxt/image 모듈)' },
  { next: 'metadata / generateMetadata', nuxt: 'useSeoMeta / useHead' },
  { next: 'fetch + revalidate (ISR)', nuxt: 'useFetch + routeRules { swr }' },
  { next: "generateStaticParams / output: 'export'", nuxt: 'nuxt generate / prerender' },
  { next: 'NEXT_PUBLIC_* (빌드 타임 인라인)', nuxt: 'runtimeConfig.public (런타임 주입)' },
  { next: 'next.config.js + webpack/Turbopack', nuxt: 'nuxt.config.ts + Vite' },
  { next: 'Vercel 에 최적화된 배포', nuxt: 'Nitro 프리셋 (Node/Vercel/Netlify/CF 등)' },
]
</script>

<template>
  <TopicPage
    :no="11"
    title="Next.js → Nuxt 이주 가이드"
    subtitle="App Router 규약 ↔ Nuxt 규약 총정리"
  >
    <p>
      Next.js(App Router)를 아는 사람이라면 Nuxt 는 <strong>"이미 아는 지도에서 이름만 바꾸는"</strong>
      수준입니다 — 파일 기반 라우팅, 레이아웃, 서버 라우트, 미들웨어, 메타데이터, ISR 까지 개념이
      거의 1:1 입니다. 결정적 차이는 두 가지: <strong>RSC 가 없고(09 토픽)</strong>, 거의 모든 것이
      <strong>빌드 타임이 아닌 런타임/라우터 레벨</strong>에서 동작한다는 점입니다.
    </p>

    <h2>규약 대응표</h2>
    <div class="my-4 overflow-hidden rounded-lg border border-border">
      <div class="grid grid-cols-[1fr_1fr] bg-surface-muted text-sm font-semibold text-heading">
        <span class="border-r border-border px-3.5 py-2.5">Next.js (App Router)</span>
        <span class="px-3.5 py-2.5">Nuxt</span>
      </div>
      <div
        v-for="(m, i) in mapping"
        :key="m.next"
        class="grid grid-cols-[1fr_1fr] text-[0.82rem]"
        :class="i < mapping.length - 1 ? 'border-b border-border' : ''"
      >
        <span class="border-r border-border px-3.5 py-2 font-mono text-muted-foreground">{{
          m.next
        }}</span>
        <span class="px-3.5 py-2 font-mono text-foreground">{{ m.nuxt }}</span>
      </div>
    </div>

    <h2>환경변수 — runtimeConfig vs NEXT_PUBLIC_*</h2>
    <CompareCode :nuxt="s.env" :vue="s.envNext" vue-label="Next.js" nuxt-lang="ts" vue-lang="ts" />

    <DemoBox title="라이브 데모 — useRuntimeConfig()">
      <p>
        <code>config.public.appVersion</code> →
        <strong class="text-foreground">{{ config.public.appVersion }}</strong>
      </p>
      <p class="mt-2.5 text-[0.82rem] text-muted-foreground">
        이 값은 <code>nuxt.config.ts</code> 의 <code>runtimeConfig.public</code> 에서 왔고, 배포
        환경에서 <code>NUXT_PUBLIC_APP_VERSION</code> 환경변수만 바꾸면 <strong>재빌드 없이</strong>
        바뀝니다 — 빌드 타임에 인라인되는 <code>NEXT_PUBLIC_*</code> 과의 가장 큰 차이입니다.
      </p>
    </DemoBox>

    <h2>앱 초기화 — plugins/ vs Provider 트리</h2>
    <CompareCode :nuxt="s.plugins" :vue="s.pluginsNext" vue-label="Next.js" nuxt-lang="ts" vue-lang="tsx" />
    <div class="key">
      React 생태계의 "Provider 지옥" 대신 Nuxt 는 <code>app/plugins/</code> 파일이 앱 시작 시 1회
      실행됩니다. 기능 확장은 <strong>모듈 생태계</strong>가 담당합니다 — <code>@nuxt/image</code>,
      <code>@nuxtjs/i18n</code>, <code>@pinia/nuxt</code> 등을 <code>nuxt.config.ts</code> 의
      <code>modules</code> 배열에 한 줄 추가하면 자동 임포트·설정까지 통합됩니다.
    </div>

    <div class="key">
      <strong>배포:</strong> <code>nuxt build</code> 의 산출물(<code>.output/</code>)은
      <strong>Nitro 프리셋</strong>으로 어디든 갑니다 — Node 서버, Vercel, Netlify, Cloudflare
      Workers, Lambda… 대부분 zero-config 로 자동 감지됩니다. Next.js 가 Vercel 밖에서 종종
      기능 제약을 겪는 것과 대비되는 지점입니다.
    </div>
  </TopicPage>
</template>
