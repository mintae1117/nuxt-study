<script setup lang="ts">
import { dataFetching as s } from '~/data/samples'

useSeoMeta({ title: '데이터 페칭 · Nuxt 학습', description: 'useFetch / useAsyncData vs onMounted + fetch' })

// 실제 server/api/users 를 호출한다. SSR 단계에서 미리 받아와 HTML 에 심긴다.
const { data: users, pending, error, refresh } = await useFetch('/api/users')
</script>

<template>
  <TopicPage
    :no="4"
    title="데이터 페칭"
    subtitle="useFetch / useAsyncData vs onMounted + fetch"
  >
    <p>
      Vue SPA 에서는 <code>onMounted</code> 안에서 <code>fetch</code> 하고 로딩/에러/데이터
      <code>ref</code> 를 매번 직접 만들었습니다. 그리고 데이터는 <strong>화면이 한 번 그려진 뒤</strong>에야
      채워졌죠(CSR). Nuxt 의 <code>useFetch</code> 는 <strong>SSR 단계에서 미리 데이터를 받아</strong>
      HTML 에 심고, 클라이언트에선 재요청하지 않습니다.
    </p>

    <div class="key">
      <strong>useFetch vs useAsyncData:</strong> <code>useFetch(url)</code> 은 URL 호출용 단축
      버전이고, <code>useAsyncData(key, fn)</code> 은 임의의 비동기 로직을 감싸는 범용 버전입니다.
      둘 다 중복 호출 방지·SSR 페이로드 전달·<code>pending</code>/<code>error</code> 상태를 자동 제공합니다.
    </div>

    <h2>데이터 + 상태 관리 — 내장 vs 수작업</h2>
    <CompareCode :nuxt="s.nuxt" :vue="s.vue" />

    <DemoBox title="라이브 데모 — 실제 /api/users (Nitro) 호출">
      <p v-if="pending" class="text-muted-foreground">로딩 중…</p>
      <p v-else-if="error" class="text-red-500">에러: {{ error.message }}</p>
      <ul v-else class="space-y-1">
        <li v-for="u in users" :key="u.id">
          <strong class="text-foreground">{{ u.name }}</strong>
          <span class="text-muted-foreground"> — {{ u.role }}</span>
        </li>
      </ul>
      <button
        class="mt-3 rounded-md border border-border-strong px-3 py-1.5 text-sm hover:border-brand hover:text-brand"
        @click="refresh()"
      >
        refresh()
      </button>
      <p class="mt-2.5 text-[0.82rem] text-muted-foreground">
        이 목록은 <code>server/api/users.ts</code> 가 반환한 데이터입니다. 페이지 소스 보기를 하면
        이 <code>&lt;li&gt;</code> 들이 <strong>이미 HTML 안에</strong> 들어 있습니다(SSR). SPA 였다면
        빈 채로 왔다가 JS 실행 후 채워졌겠죠.
      </p>
    </DemoBox>

    <h2>Next.js 와 비교 — 페칭/인터랙션 분리가 없다</h2>
    <p>
      Next.js App Router 는 <strong>페칭은 서버 컴포넌트, 인터랙션은 'use client' 컴포넌트</strong>로
      쪼개야 했습니다. Nuxt 는 같은 컴포넌트에서 <code>await useFetch</code> 와
      <code>@click</code> 을 함께 씁니다. <code>loading.tsx</code> 가 하던 일은
      <code>lazy</code> 옵션 + <code>status</code> 로, Server Actions 가 하던 변이는
      <code>$fetch</code> POST 로 대응합니다.
    </p>
    <CompareCode
      :nuxt="s.options"
      :vue="s.next"
      vue-label="Next.js"
      nuxt-lang="ts"
      vue-lang="tsx"
    />
    <div class="key">
      <strong>캐싱 멘탈 모델 차이:</strong> Next 는 <code>fetch</code> 자체에 캐시 계층(요청
      메모이제이션·revalidate)을 심었지만, Nuxt 의 <code>useFetch</code> 캐싱은
      <strong>key 기반 중복 제거 + SSR 페이로드 재사용</strong>이 기본입니다. ISR 류 캐싱은 페칭이
      아니라 <strong>라우트 레벨</strong>(<code>routeRules</code> 의 <code>swr</code>)에서 겁니다 —
      5번 렌더링 모드 토픽 참고.
    </div>
  </TopicPage>
</template>
