<script setup lang="ts">
// 모든 토픽 페이지가 공유하는 헤더 + 본문 레이아웃.
// 본문은 .prose-content 클래스로 전역 타이포그래피를 적용한다(main.css 참고).
defineProps<{ no: number; title: string; subtitle: string }>()
</script>

<template>
  <article class="max-w-[880px]">
    <header class="mb-6 flex items-center gap-4 border-b border-border pb-4">
      <span class="text-3xl font-bold tabular-nums text-brand">{{
        String(no).padStart(2, '0')
      }}</span>
      <div>
        <h1 class="text-2xl font-semibold leading-tight text-heading">{{ title }}</h1>
        <p class="text-sm text-muted-foreground">{{ subtitle }}</p>
      </div>
    </header>
    <div class="prose-content">
      <slot />
    </div>
  </article>
</template>
