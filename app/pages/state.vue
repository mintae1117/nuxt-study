<script setup lang="ts">
import { state as s } from '~/data/samples'

useSeoMeta({ title: '상태 공유 · Nuxt 학습', description: 'useState (SSR 안전) vs ref 모듈 싱글톤' })

// useState: SSR 안전한 전역 상태. key('demo-count')로 식별되며,
// 다른 페이지로 갔다 와도(이 앱 안에서) 값이 유지된다.
const count = useState('demo-count', () => 0)
</script>

<template>
  <TopicPage
    :no="8"
    title="상태 공유"
    subtitle="useState (SSR 안전) vs ref 모듈 싱글톤"
  >
    <p>
      Vue SPA 에서는 모듈 최상단에 <code>export const count = ref(0)</code> 를 두면 import 하는 모든
      곳이 공유하는 전역 상태가 됐습니다(우리가 <code>useTheme</code> 에서 쓴 패턴). 그런데 <strong>SSR
      에서는 이게 위험</strong>합니다.
    </p>

    <div class="key">
      <strong>왜 위험한가:</strong> 서버에서 모듈은 <em>한 번만</em> 평가되어 모든 요청이 같은
      <code>ref</code> 인스턴스를 공유합니다. → A 사용자의 상태가 B 사용자 응답에 섞이는
      <strong>cross-request 상태 오염</strong>. Nuxt 의 <code>useState</code> 는 <strong>요청마다
      격리</strong>되고, 서버 값이 클라이언트로 직렬화돼 그대로 이어집니다.
    </div>

    <h2>전역 상태 — useState vs 모듈 ref</h2>
    <CompareCode :nuxt="s.nuxt" :vue="s.vue" :vue-lang="s.vueLang" />

    <DemoBox title="라이브 데모 — useState (전역)">
      <div class="flex flex-wrap items-center gap-4">
        <button
          class="rounded-md border border-border-strong px-3 py-1.5 text-sm hover:border-brand hover:text-brand"
          @click="count++"
        >
          count++
        </button>
        <span>count = <strong class="text-foreground">{{ count }}</strong></span>
      </div>
      <p class="mt-2.5 text-[0.82rem] text-muted-foreground">
        이 값은 <code>useState('demo-count')</code> 로 전역입니다. 다른 토픽 메뉴로 갔다가 돌아와도
        값이 유지됩니다 — 같은 key 의 상태를 공유하기 때문입니다.
      </p>
    </DemoBox>

    <div class="key">
      대규모 상태에는 여전히 <strong>Pinia</strong> 를 씁니다(Nuxt 는 <code>@pinia/nuxt</code> 로
      매끄럽게 통합). <code>useState</code> 는 "SSR 안전한 가벼운 <code>ref</code>" 정도로 보면 됩니다.
    </div>

    <div class="key">
      <strong>Next.js 개발자라면:</strong> "서버에서 만든 값이 클라이언트 상태로 그대로 이어지는"
      프리미티브가 Next 엔 없어서, RSC → props 직렬화나 Context 초기값 주입을 수작업했을 겁니다.
      <code>useState</code> 가 정확히 그 빈자리입니다. 쿠키 기반이라면 <code>useCookie</code> 도
      있습니다 — 서버/클라 <strong>양쪽에서 읽고 쓰는</strong> SSR-safe 쿠키 ref 로, RSC 의
      <code>cookies()</code> 가 읽기 전용이었던 것과 대비됩니다.
    </div>
  </TopicPage>
</template>
