<script setup lang="ts">
import { hydration as s } from '~/data/samples'

useSeoMeta({
  title: '하이드레이션 & 클라이언트 코드 · Nuxt 학습',
  description: 'universal 컴포넌트 / ClientOnly vs use client / dynamic ssr:false',
})

// 하이드레이션 데모: SSR HTML 에는 false 로 박혀 나가고,
// 클라이언트에서 하이드레이션이 끝나면 true 로 바뀐다.
const hydrated = ref(false)
const width = ref(0)
onMounted(() => {
  hydrated.value = true
  width.value = window.innerWidth // onMounted 안이라 서버에서 안전
})
</script>

<template>
  <TopicPage
    :no="9"
    title="하이드레이션 & 클라이언트 코드"
    subtitle="universal 컴포넌트 / <ClientOnly> vs 'use client' / dynamic"
  >
    <p>
      <strong>Next.js 개발자가 가장 먼저 바로잡아야 할 멘탈 모델입니다.</strong> Nuxt 에는
      RSC(서버 컴포넌트)가 없습니다 — <code>'use client'</code> 도, 서버/클라 컴포넌트 경계도
      없습니다. 대신 <strong>모든 컴포넌트가 universal</strong> 입니다: 서버에서 한 번 실행되어
      HTML 을 만들고(SSR), 브라우저에서 다시 실행되어 이벤트를 붙입니다(하이드레이션).
    </p>

    <h2>경계 없음 — universal vs 'use client'</h2>
    <CompareCode :nuxt="s.universal" :vue="s.useClient" vue-label="Next.js" vue-lang="tsx" />
    <div class="key">
      <strong>장점:</strong> 페칭과 인터랙션을 컴포넌트 단위로 쪼갤 필요가 없습니다.
      <strong>대가:</strong> 모든 코드가 서버에서도 한 번 돈다는 사실을 늘 의식해야 합니다 — 그래서
      아래의 가드 패턴들이 필요합니다.
    </div>

    <h2>클라이언트 전용 컴포넌트 — &lt;ClientOnly&gt; vs dynamic(ssr:false)</h2>
    <CompareCode :nuxt="s.clientOnly" :vue="s.dynamicSsrFalse" vue-label="Next.js" vue-lang="tsx" />

    <h2>window 가드 & 하이드레이션 불일치</h2>
    <CompareCode
      :nuxt="s.windowGuard"
      :vue="s.windowGuardNext"
      vue-label="Next.js"
      nuxt-lang="ts"
      vue-lang="tsx"
    />

    <DemoBox title="라이브 데모 — 하이드레이션을 눈으로 보기">
      <ul class="space-y-1">
        <li>
          hydrated =
          <strong class="text-foreground">{{ hydrated }}</strong>
          <span class="text-muted-foreground">
            — 서버가 보낸 HTML 에는 false 로 박혀 있었고, 하이드레이션 직후 true 가 됐습니다.</span
          >
        </li>
        <li>
          <ClientOnly>
            <span
              >window.innerWidth = <strong class="text-foreground">{{ width }}px</strong>
              <span class="text-muted-foreground"> — 이 줄 전체가 클라이언트에서만 렌더됩니다.</span></span
            >
            <template #fallback>
              <span class="text-muted-foreground">(SSR 자리표시자 — JS 로드 전엔 이 문구가 보입니다)</span>
            </template>
          </ClientOnly>
        </li>
      </ul>
      <p class="mt-2.5 text-[0.82rem] text-muted-foreground">
        새로고침 직후 아주 잠깐 false / 자리표시자가 보였다면, 그게 바로 "SSR HTML → 하이드레이션"
        의 간극입니다. <strong>페이지 소스 보기</strong>를 하면 지금도 false 로 적혀 있습니다.
      </p>
    </DemoBox>

    <div class="key">
      <strong>요약:</strong> Next.js 에선 <code>'use client'</code> 라는 <em>선언</em>으로 경계를
      그었다면, Nuxt 에선 <code>onMounted</code> / <code>import.meta.client</code> /
      <code>&lt;ClientOnly&gt;</code> / <code>*.client.vue</code> 라는 <em>가드</em>로 클라이언트
      전용 코드를 표시합니다. 묻는 질문이 "이 컴포넌트는 어디서 도는가?"에서
      <strong>"이 코드는 서버에서도 안전한가?"</strong>로 바뀝니다.
    </div>
  </TopicPage>
</template>
