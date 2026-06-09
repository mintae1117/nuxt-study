<script setup lang="ts">
import { seo as s } from '~/data/samples'

// 이 호출이 곧 이 페이지의 시연이다 — 브라우저 탭 제목이 아래 title 로 바뀐다.
useSeoMeta({
  title: 'SEO & 메타 태그 · Nuxt 학습',
  description: 'useHead / useSeoMeta 로 타입 안전하게 메타를 제어한다',
  ogTitle: 'Nuxt SEO 학습',
})
</script>

<template>
  <TopicPage
    :no="6"
    title="SEO & 메타 태그"
    subtitle="useHead / useSeoMeta vs 라이브러리 필요"
  >
    <p>
      Vue SPA 는 <code>document.title</code> 을 JS 로 직접 바꾸거나 <code>@unhead/vue</code> 같은
      라이브러리를 따로 설치해야 했습니다. 게다가 CSR 이라 메타가 <strong>JS 실행 후에야</strong> 적용돼
      크롤러에 불리했죠. Nuxt 는 <code>useHead</code>·<code>useSeoMeta</code> 를 내장하고,
      <strong>SSR 이라 메타가 처음부터 HTML 에</strong> 들어갑니다.
    </p>

    <div class="key">
      <code>useSeoMeta</code> 는 <code>ogTitle</code>, <code>twitterCard</code> 등 메타 이름을
      <strong>타입 안전한 키</strong>로 제공합니다(오타 방지). 더 일반적인 태그(link, htmlAttrs 등)는
      <code>useHead</code> 로 다룹니다.
    </div>

    <h2>메타 제어 — 내장 vs 수동/라이브러리</h2>
    <CompareCode :nuxt="s.nuxt" :vue="s.vue" />

    <DemoBox title="라이브 데모 — 지금 이 페이지">
      <p class="text-[0.85rem]">
        이 페이지의 <code>&lt;script setup&gt;</code> 에서 <code>useSeoMeta({ title: 'SEO &amp; 메타 태그 …' })</code>
        를 호출했습니다. 그래서 <strong>브라우저 탭 제목</strong>이 바뀌어 있을 겁니다. 다른 토픽으로
        이동하면 그 페이지의 제목으로 다시 바뀝니다.
      </p>
    </DemoBox>
  </TopicPage>
</template>
