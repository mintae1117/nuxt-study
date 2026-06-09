<script setup lang="ts">
import { layouts as s } from '~/data/samples'

useSeoMeta({ title: '레이아웃 시스템 · Nuxt 학습', description: 'layouts/ + NuxtLayout vs 수동 래핑' })
</script>

<template>
  <TopicPage
    :no="3"
    title="레이아웃 시스템"
    subtitle="layouts/ + <NuxtLayout> vs 직접 래핑"
  >
    <p>
      Vue 에는 "레이아웃"이라는 1급 개념이 없어, 공통 헤더/사이드바를 컴포넌트로 직접 감싸거나 중첩
      라우트로 흉내 냈습니다. Nuxt 는 <code>app/layouts/</code> 디렉터리와 <code>&lt;NuxtLayout&gt;</code> 로
      <strong>페이지 껍데기를 분리</strong>합니다.
    </p>

    <div class="key">
      <code>layouts/default.vue</code> 는 자동으로 모든 페이지의 기본 레이아웃이 됩니다.
      페이지에서 <code>definePageMeta({ layout: 'admin' })</code> 라고 적으면 그 페이지만
      <code>layouts/admin.vue</code> 를 씁니다.
    </div>

    <h2>레이아웃 선언 — layouts/ vs 컴포넌트 래핑</h2>
    <CompareCode :nuxt="s.nuxt" :vue="s.vue" :vue-lang="s.vueLang" />

    <div class="key">
      <strong>지금 이 페이지가 증거입니다.</strong> 왼쪽 사이드바는 제가 작성한
      <code>layouts/default.vue</code> 의 <code>&lt;slot /&gt;</code> 바깥 부분이고, 이 본문은
      <code>&lt;slot /&gt;</code> 안으로 들어온 <code>pages/layouts.vue</code> 입니다. 메뉴를 바꿔도
      사이드바는 그대로 유지되죠 — 레이아웃이 페이지와 분리돼 있기 때문입니다.
    </div>

    <div class="key">
      <strong>구조 정리:</strong> <code>app.vue</code> →
      <code>&lt;NuxtLayout&gt;&lt;NuxtPage /&gt;&lt;/NuxtLayout&gt;</code>.
      바깥 껍데기는 <code>NuxtLayout</code>(layouts/), 그 안에서 바뀌는 본문은 <code>NuxtPage</code>(pages/).
    </div>
  </TopicPage>
</template>
