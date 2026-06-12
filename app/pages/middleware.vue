<script setup lang="ts">
import { middlewareError as s } from '~/data/samples'

useSeoMeta({
  title: '미들웨어 & 에러 처리 · Nuxt 학습',
  description: 'defineNuxtRouteMiddleware / error.vue vs middleware.ts / error.tsx',
})

// 이 선언으로 app/middleware/demo-log.ts 가 이 페이지 진입마다 실행된다 (라이브 데모).
definePageMeta({ middleware: 'demo-log' })

const mwLog = useState<string[]>('mw-log', () => [])

// createError 데모 — 401 을 던지는 /api/secret 호출
const token = ref('')
const secretReply = ref('')
const secretError = ref('')

async function callSecret() {
  secretReply.value = ''
  secretError.value = ''
  try {
    const res = await $fetch<{ secret: string }>('/api/secret', {
      query: { token: token.value },
    })
    secretReply.value = res.secret
  } catch (e) {
    // $fetch 는 4xx/5xx 에서 statusCode 가 담긴 FetchError 를 던진다
    const err = e as { statusCode?: number; data?: { statusMessage?: string } }
    secretError.value = `${err.statusCode} — ${err.data?.statusMessage ?? '에러'}`
  }
}
</script>

<template>
  <TopicPage
    :no="10"
    title="미들웨어 & 에러 처리"
    subtitle="defineNuxtRouteMiddleware / error.vue vs middleware.ts / error.tsx"
  >
    <p>
      Next.js 의 <code>middleware.ts</code> 는 프로젝트에 <strong>단 1개</strong>, Edge 런타임에서
      돌고 <code>matcher</code> 로 범위를 지정했습니다. Nuxt 의 라우트 미들웨어는
      <code>app/middleware/</code> 에 <strong>여러 개</strong> 두고, 페이지가
      <code>definePageMeta</code> 로 골라 씁니다 — vue-router 의 navigation guard 를 파일 규약으로
      포장한 것입니다.
    </p>

    <h2>라우트 미들웨어 — 여러 개 + 페이지 선택 vs 전역 1개 + matcher</h2>
    <CompareCode :nuxt="s.routeMw" :vue="s.nextMw" vue-label="Next.js" nuxt-lang="ts" vue-lang="ts" />

    <DemoBox title="라이브 데모 — 이 페이지에 걸린 demo-log 미들웨어">
      <p class="text-[0.85rem]">
        이 페이지는 <code>definePageMeta({ middleware: 'demo-log' })</code> 를 선언했습니다. 다른
        메뉴에 갔다가 돌아올 때마다 기록이 쌓입니다:
      </p>
      <ul class="mt-2 space-y-0.5 font-mono text-[0.78rem]">
        <li v-for="(l, i) in mwLog" :key="mwLog.length - i">{{ l }}</li>
        <li v-if="!mwLog.length" class="opacity-50">아직 기록이 없습니다…</li>
      </ul>
      <p class="mt-2.5 text-[0.82rem] text-muted-foreground">
        첫 줄이 <strong>[서버에서 실행]</strong> 이라면 SSR 첫 진입, 이후 클라이언트 내비게이션은
        <strong>[클라이언트에서 실행]</strong> 으로 찍힙니다 — 미들웨어도 universal 입니다.
      </p>
    </DemoBox>

    <h2>에러 처리 — error.vue + createError vs error.tsx + notFound()</h2>
    <p>
      Next.js 는 폴더마다 <code>error.tsx</code> / <code>not-found.tsx</code> 를 두는 분산형, Nuxt
      는 <strong>앱 루트의 <code>error.vue</code> 하나</strong>로 모이는 중앙형입니다. 어디서든
      <code>throw createError({ statusCode })</code> 하면 — 페이지든 미들웨어든 server API 든 —
      상태코드까지 올바르게 응답됩니다.
    </p>
    <CompareCode :nuxt="s.errorPage" :vue="s.nextError" vue-label="Next.js" vue-lang="tsx" />

    <DemoBox title="라이브 데모 — createError 가 던진 401 받기">
      <div class="flex flex-wrap items-center gap-3">
        <input
          v-model="token"
          class="h-9 rounded-md border border-border-strong bg-background px-3 text-sm"
          placeholder="token (정답: nuxt)"
          @keyup.enter="callSecret"
        />
        <button
          class="rounded-md border border-border-strong px-3 py-1.5 text-sm hover:border-brand hover:text-brand"
          @click="callSecret"
        >
          $fetch('/api/secret')
        </button>
      </div>
      <p v-if="secretReply" class="mt-3 rounded-md bg-surface-muted px-3 py-2 text-[0.85rem]">
        {{ secretReply }}
      </p>
      <p v-if="secretError" class="mt-3 rounded-md bg-surface-muted px-3 py-2 text-[0.85rem] text-red-500">
        {{ secretError }}
      </p>
      <p class="mt-2.5 text-[0.82rem] text-muted-foreground">
        <code>server/api/secret.ts</code> 가 <code>throw createError({ statusCode: 401 })</code> 한
        것을 <code>$fetch</code> 가 <code>FetchError</code> 로 받아 표시했습니다. 페이지 쪽에서
        잡지 않고 렌더 중에 던지면 <code>error.vue</code> 가 대신 그려집니다.
      </p>
    </DemoBox>

    <div class="key">
      <strong>부분 에러 경계가 필요하면:</strong> React 의 ErrorBoundary 처럼 화면 일부만 감싸는
      <code>&lt;NuxtErrorBoundary&gt;</code> 컴포넌트도 있습니다 — 전체 페이지를
      <code>error.vue</code> 로 보내고 싶지 않을 때 사용합니다.
    </div>
  </TopicPage>
</template>
