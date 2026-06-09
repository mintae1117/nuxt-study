<script setup lang="ts">
import { rendering as s } from '~/data/samples'

useSeoMeta({ title: '렌더링 모드 · Nuxt 학습', description: 'SSR / SSG / SPA / 하이브리드' })
</script>

<template>
  <TopicPage
    :no="5"
    title="렌더링 모드"
    subtitle="SSR / SSG / SPA / 하이브리드 vs CSR 고정"
  >
    <p>
      Vue + Vite 앱은 기본이 <strong>CSR(클라이언트 렌더링)</strong> 한 가지입니다. 빈
      <code>&lt;div id="app"&gt;</code> 에 JS 로 화면을 그리죠. Nuxt 는 <strong>경로마다 렌더링
      전략을 골라</strong> 섞을 수 있습니다.
    </p>

    <ul>
      <li><strong>SSR</strong> (기본): 요청 때마다 서버에서 HTML 생성 → 빠른 첫 페인트 + SEO</li>
      <li><strong>SSG</strong> (<code>nuxt generate</code> / <code>prerender</code>): 빌드 때 정적 HTML 생성 → CDN 배포</li>
      <li><strong>SPA</strong> (<code>ssr: false</code>): Vue 처럼 클라이언트 전용</li>
      <li><strong>하이브리드</strong> (<code>routeRules</code>): 위를 경로별로 혼합</li>
    </ul>

    <h2>렌더링 전략 — routeRules vs CSR 고정</h2>
    <CompareCode :nuxt="s.nuxt" :vue="s.vue" :nuxt-lang="s.nuxtLang" :vue-lang="s.vueLang" />

    <div class="key">
      <strong>왜 중요한가:</strong> SSR/SSG 면 크롤러와 사용자가 <em>완성된 HTML</em> 을 즉시 받습니다.
      CSR 은 JS 다운로드·실행 후에야 내용이 보여서 첫 페인트가 느리고 SEO 에 불리합니다. 이게 Nuxt 를
      쓰는 가장 큰 이유 중 하나입니다.
    </div>

    <DemoBox title="확인 방법">
      <p class="text-[0.85rem]">
        이 앱은 기본 SSR 입니다. 브라우저에서 <strong>페이지 소스 보기</strong>(Ctrl/Cmd+U)를 하면
        본문 텍스트가 HTML 에 그대로 들어 있습니다. 순수 Vue SPA 라면 거의 빈 <code>&lt;div&gt;</code> 만
        보일 겁니다.
      </p>
    </DemoBox>
  </TopicPage>
</template>
