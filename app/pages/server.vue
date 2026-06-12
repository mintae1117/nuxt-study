<script setup lang="ts">
import { ref } from 'vue'
import { server as s } from '~/data/samples'

useSeoMeta({ title: '서버 라우트 (Nitro) · Nuxt 학습', description: 'server/api 풀스택 vs 별도 백엔드' })

const name = ref('민태')
const reply = ref<string>('')

async function callApi() {
  // $fetch: Nuxt 내장 fetch 래퍼(자동 임포트). 서버 라우트를 직접 호출.
  const res = await $fetch('/api/hello', { query: { name: name.value } })
  reply.value = res.message
}
</script>

<template>
  <TopicPage
    :no="7"
    title="서버 라우트 (Nitro)"
    subtitle="server/api 풀스택 vs 별도 백엔드"
  >
    <p>
      순수 Vue 는 <strong>프론트엔드 전용</strong>이라 API 가 필요하면 Express 같은 백엔드를 별도
      프로젝트로 띄워야 했습니다. Nuxt 에는 <strong>Nitro</strong> 라는 서버 엔진이 내장돼 있어,
      <code>server/api/</code> 에 파일을 만들면 <strong>같은 프로젝트가 곧 백엔드</strong>가 됩니다.
    </p>

    <div class="key">
      <code>server/api/users.ts</code> → <code>GET /api/users</code>. 핸들러는
      <code>defineEventHandler</code> 로 만들고, 반환값은 자동으로 JSON 직렬화됩니다.
      <code>[id].ts</code> 동적 라우트, <code>getQuery</code>/<code>readBody</code> 등 헬퍼도 내장.
    </div>

    <h2>API 작성 — server/api vs 별도 Express</h2>
    <CompareCode :nuxt="s.nuxt" :vue="s.vue" :nuxt-lang="s.nuxtLang" :vue-lang="s.vueLang" />

    <DemoBox title="라이브 데모 — 실제 /api/hello 호출 ($fetch)">
      <div class="flex flex-wrap items-center gap-3">
        <input
          v-model="name"
          class="h-9 rounded-md border border-border-strong bg-background px-3 text-sm"
          placeholder="이름"
        />
        <button
          class="rounded-md border border-border-strong px-3 py-1.5 text-sm hover:border-brand hover:text-brand"
          @click="callApi"
        >
          $fetch('/api/hello')
        </button>
      </div>
      <p v-if="reply" class="mt-3 rounded-md bg-surface-muted px-3 py-2 text-[0.85rem]">
        {{ reply }}
      </p>
      <p class="mt-2.5 text-[0.82rem] text-muted-foreground">
        이 응답 문자열은 <code>server/api/hello.ts</code> 가 서버에서 만든 것입니다. 브라우저는
        그저 <code>/api/hello</code> 를 호출할 뿐입니다.
      </p>
    </DemoBox>

    <h2>REST 컨벤션 — 파일명 접미사 vs route.ts 의 export</h2>
    <p>
      Next.js 는 <code>route.ts</code> 한 파일 안에서 <code>GET</code>/<code>POST</code> 함수를
      export 하지만, Nuxt 는 <strong>파일명 접미사</strong>(<code>.get.ts</code>,
      <code>.post.ts</code>)로 메서드를 나눕니다. body 파싱·에러 응답도 헬퍼 한 줄입니다.
    </p>
    <CompareCode :nuxt="s.rest" :vue="s.nextRoute" vue-label="Next.js" nuxt-lang="ts" vue-lang="ts" />
    <div class="key">
      <strong>Next.js 개발자라면:</strong> Server Actions 에 해당하는 것은 따로 없습니다 — 변이도
      그냥 <code>server/api/*.post.ts</code> + <code>$fetch</code> 입니다. 대신 라우트 핸들러
      바깥의 도구가 더 많습니다: <code>server/middleware/</code>(모든 요청에 실행),
      <code>server/routes/</code>(API 외 경로), 그리고 <code>defineCachedEventHandler</code> 로
      핸들러 자체를 캐시할 수도 있습니다.
    </div>
  </TopicPage>
</template>
