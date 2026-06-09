<script setup lang="ts">
import { topics } from "~/data/topics";

useSeoMeta({
  title: "Nuxt ↔ Vue 학습 노트",
  description: "Vue 를 아는 사람을 위한 Nuxt 비교 학습 가이드",
});

const mapping: { vue: string; nuxt: string }[] = [
  { vue: "vue-router 수동 설정", nuxt: "pages/ 파일 기반 라우팅" },
  { vue: "매번 import", nuxt: "자동 임포트(컴포넌트/composable/Vue API)" },
  { vue: "레이아웃 직접 래핑", nuxt: "layouts/ + <NuxtLayout>" },
  { vue: "onMounted + fetch", nuxt: "useFetch / useAsyncData (SSR)" },
  { vue: "CSR 한 가지", nuxt: "SSR / SSG / SPA / 하이브리드" },
  { vue: "document.title / 라이브러리", nuxt: "useHead / useSeoMeta" },
  { vue: "별도 백엔드 필요", nuxt: "server/api (Nitro 내장)" },
  { vue: "ref 모듈 싱글톤(SSR 위험)", nuxt: "useState (요청 격리)" },
];
</script>

<template>
  <div class="max-w-220">
    <header>
      <h1 class="text-3xl font-bold leading-tight text-heading">
        Vue 개발자를 위한 <span class="text-brand">Nuxt</span> 학습 노트
      </h1>
      <p class="mt-3 text-base text-muted-foreground">
        이미 Vue 3 (Composition API)를 아는 사람 입장에서, Nuxt 가 그 위에
        무엇을 더 얹어주는지 비교하며 익히는 가이드입니다. 각 주제마다
        <strong class="font-semibold text-foreground"
          >개념 · 라이브 데모 · Nuxt vs Vue 코드 비교</strong
        >가 들어 있습니다.
      </p>
    </header>

    <section>
      <h2 class="mb-3 mt-9 text-xl font-semibold text-heading">
        한 장 요약 — 멘탈 모델 매핑
      </h2>
      <p class="mb-3 text-sm text-muted-foreground">
        Nuxt 는 새로운 프레임워크가 아니라
        <strong class="text-foreground">"Vue + 풀스택 메타 프레임워크"</strong
        >입니다. 핵심은 대부분
        <strong class="text-foreground">SSR(서버 렌더링)</strong>과
        <strong class="text-foreground">규약 기반 자동화</strong>에서 나옵니다.
      </p>
      <div class="overflow-hidden rounded-lg border border-border">
        <div
          class="grid grid-cols-[1fr_1.3fr] bg-surface-muted font-semibold text-heading"
        >
          <span class="border-r border-border px-3.5 py-2.5">Vue (plain)</span>
          <span class="px-3.5 py-2.5">Nuxt</span>
        </div>
        <div
          v-for="(m, i) in mapping"
          :key="m.vue"
          class="grid grid-cols-[1fr_1.3fr]"
          :class="i < mapping.length - 1 ? 'border-b border-border' : ''"
        >
          <span
            class="border-r border-border px-3.5 py-2 text-muted-foreground"
            >{{ m.vue }}</span
          >
          <span class="px-3.5 py-2 text-foreground">{{ m.nuxt }}</span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-3 mt-9 text-xl font-semibold text-heading">학습 토픽</h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
        <NuxtLink
          v-for="t in topics"
          :key="t.path"
          :to="t.path"
          class="group flex flex-col gap-1 rounded-xl border border-border p-4 no-underline transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-surface"
        >
          <span class="text-xs font-bold text-brand">{{
            String(t.no).padStart(2, "0")
          }}</span>
          <span class="font-semibold text-heading">{{ t.title }}</span>
          <span class="text-xs text-muted-foreground">{{ t.summary }}</span>
        </NuxtLink>
      </div>
    </section>

    <div class="key prose-content mt-8">
      <strong>이 앱 자체가 Nuxt 데모입니다.</strong> 사이드바는
      <code>layouts/default.vue</code>, 각 토픽은
      <code>app/pages/*.vue</code> (파일 기반 라우팅), 코드 비교는 자동 임포트된
      <code>&lt;CompareCode&gt;</code>, 데이터 페칭 페이지는 실제
      <code>server/api</code> 를 호출합니다.
    </div>
  </div>
</template>
