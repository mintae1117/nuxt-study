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
  </TopicPage>
</template>
