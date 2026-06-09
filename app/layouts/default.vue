<script setup lang="ts">
// 기본 레이아웃 = 사이드바 + 본문. (vue-study 의 App.vue 레이아웃을 포팅)
// ★ Nuxt 학습 포인트: 이 파일이 layouts/default.vue 라는 이유만으로
//   모든 페이지의 공통 껍데기가 된다. <slot /> 자리에 각 페이지가 들어온다.
import { topics } from '~/data/topics'
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
    <aside class="sidebar">
      <!-- NuxtLink = vue-router 의 <RouterLink>. 클릭 시 프리페치까지 자동. -->
      <NuxtLink to="/" class="brand">
        <span class="brand-logo">▲</span>
        <div>
          <div class="brand-title">Nuxt ↔ Vue</div>
          <div class="brand-sub">학습 노트</div>
        </div>
      </NuxtLink>

      <nav class="nav">
        <NuxtLink to="/" class="nav-link">🏠 개요 / 멘탈 모델</NuxtLink>
        <span class="nav-section">TOPICS</span>
        <NuxtLink v-for="t in topics" :key="t.path" :to="t.path" class="nav-link">
          <span class="nav-no">{{ String(t.no).padStart(2, '0') }}</span>
          {{ t.title }}
        </NuxtLink>
      </nav>

      <div class="side-foot">
        <div class="foot-row">
          <span>테마</span>
          <ThemeToggle />
        </div>
        <p class="foot-note">Vue 개발자용 Nuxt 비교 가이드</p>
      </div>
    </aside>

    <main class="px-6 py-8 md:px-12 md:py-10" style="min-width: 0">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  border-right: 1px solid var(--border);
  background: var(--surface);
  overflow-y: auto;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  margin-bottom: 1.5rem;
}
.brand-logo {
  font-size: 1.4rem;
  line-height: 1;
  color: var(--brand);
}
.brand-title {
  font-weight: 700;
  color: var(--heading);
  font-size: 0.95rem;
}
.brand-sub {
  font-size: 0.75rem;
  color: var(--muted-foreground);
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
}
.nav-section {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--muted-foreground);
  margin: 1rem 0 0.4rem 0.6rem;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  border-radius: 7px;
  text-decoration: none;
  color: var(--foreground);
  font-size: 0.88rem;
  transition: all 0.15s;
}
.nav-link:hover {
  background: var(--surface-muted);
}
.nav-no {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted-foreground);
  font-variant-numeric: tabular-nums;
}
/* Nuxt 가 활성 라우트에 자동으로 붙이는 클래스 (vue-router 와 동일) */
.nav-link.router-link-active.router-link-exact-active {
  background: var(--brand-soft);
  color: var(--brand);
  font-weight: 600;
}
.nav-link.router-link-exact-active .nav-no {
  color: var(--brand);
}
.side-foot {
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  margin-top: 1rem;
}
.foot-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  color: var(--muted-foreground);
  margin-bottom: 0.7rem;
}
.foot-note {
  font-size: 0.72rem;
  color: var(--muted-foreground);
  opacity: 0.8;
}
@media (max-width: 767px) {
  .sidebar {
    position: static;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }
}
</style>
