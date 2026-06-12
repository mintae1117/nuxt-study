<script setup lang="ts">
import { routing as s } from '~/data/samples'

// 이 페이지의 SEO 메타 — useSeoMeta 자체가 토픽 06 의 시연이기도 하다.
useSeoMeta({ title: '파일 기반 라우팅 · Nuxt 학습', description: 'pages/ 디렉터리 vs vue-router' })

const route = useRoute()
</script>

<template>
  <TopicPage
    :no="1"
    title="파일 기반 라우팅"
    subtitle="pages/ 디렉터리 vs vue-router 수동 설정"
  >
    <p>
      Vue 에서는 <code>vue-router</code> 를 설치하고 <code>routes</code> 배열을 손으로 작성했습니다.
      Nuxt 는 <strong>파일 시스템이 곧 라우터</strong>입니다. <code>app/pages/</code> 에 파일을
      만들면 그 경로가 자동으로 라우트가 됩니다. 설정 파일도, <code>app.use(router)</code> 도 없습니다.
    </p>

    <div class="key">
      <strong>규칙:</strong> <code>index.vue</code> → <code>/</code>, <code>about.vue</code> →
      <code>/about</code>, <code>[id].vue</code> → <code>/:id</code> (동적),
      <code>[...slug].vue</code> → 캐치올. 폴더 구조가 그대로 URL 구조가 됩니다.
    </div>

    <h2>라우트 정의 — 파일 생성 vs 배열 작성</h2>
    <CompareCode :nuxt="s.nuxt" :vue="s.vue" :vue-lang="s.vueLang" />

    <DemoBox title="라이브 데모 — 현재 라우트 정보 (useRoute)">
      <ul class="space-y-1">
        <li><code>route.path</code> → <strong class="text-foreground">{{ route.path }}</strong></li>
        <li><code>route.name</code> → <strong class="text-foreground">{{ String(route.name) }}</strong></li>
      </ul>
      <p class="mt-2.5 text-[0.82rem] text-muted-foreground">
        <code>route.name</code> 이 <code>routing</code> 인 것에 주목 — 파일명
        <code>pages/routing.vue</code> 에서 Nuxt 가 자동으로 이름을 붙였습니다.
      </p>
    </DemoBox>

    <div class="key">
      <strong>정리:</strong> 멘탈 모델은 vue-router 와 같습니다(<code>&lt;NuxtLink&gt;</code> =
      <code>&lt;RouterLink&gt;</code>, <code>useRoute()</code> 동일). 다만 <em>라우트를 코드로 선언하지
      않는다</em>는 게 핵심 차이입니다.
    </div>

    <div class="key">
      <strong>Next.js 개발자라면:</strong> <code>app/users/[id]/page.tsx</code> ↔
      <code>pages/users/[id].vue</code> — 폴더 + <code>page.tsx</code> 대신 <strong>파일 하나가 곧
      페이지</strong>입니다. <code>&lt;NuxtLink&gt;</code> 는 <code>&lt;Link&gt;</code> 처럼 뷰포트에
      들어오면 prefetch 하고, 코드 리다이렉트는 <code>navigateTo()</code> 하나가
      <code>redirect()</code>(서버)와 <code>router.push()</code>(클라)를 겸합니다. 페이지 단위
      가드·검증은 <code>definePageMeta({ middleware, validate })</code> — 10번 토픽 참고.
    </div>
  </TopicPage>
</template>
