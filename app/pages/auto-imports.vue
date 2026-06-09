<script setup lang="ts">
import { autoImports as s } from '~/data/samples'

useSeoMeta({ title: '자동 임포트 · Nuxt 학습', description: 'Nuxt 자동 임포트 vs 수동 import' })

// 아래 ref / computed 는 import 하지 않았는데도 동작한다 (Nuxt 자동 임포트).
const count = ref(0)
const double = computed(() => count.value * 2)
</script>

<template>
  <TopicPage
    :no="2"
    title="자동 임포트"
    subtitle="ref / 컴포넌트 / composable 자동 vs 매번 import"
  >
    <p>
      Vue 에서는 <code>ref</code>, <code>computed</code>, 컴포넌트, composable 을 매번
      <code>import</code> 했습니다. Nuxt 는 이것들을 <strong>전부 자동으로 임포트</strong>합니다.
      Vue API, <code>app/components/*</code>, <code>app/composables/*</code>, 그리고
      <code>useFetch</code>·<code>useState</code> 같은 Nuxt 내장 함수까지요.
    </p>

    <div class="key">
      빌드 타임에 Nuxt 가 코드를 스캔해 필요한 import 를 자동 주입합니다. 그래서 번들에는 실제로 쓴
      것만 들어가고(트리셰이킹 유지), 타입 추론·자동완성도 정상 동작합니다.
    </div>

    <h2>같은 코드, import 유무</h2>
    <CompareCode :nuxt="s.nuxt" :vue="s.vue" />

    <DemoBox title="라이브 데모 — import 없이 쓴 ref / computed">
      <div class="flex flex-wrap items-center gap-4">
        <button
          class="rounded-md border border-border-strong px-3 py-1.5 text-sm hover:border-brand hover:text-brand"
          @click="count++"
        >
          count++
        </button>
        <span>count = <strong class="text-foreground">{{ count }}</strong></span>
        <span>double = <strong class="text-foreground">{{ double }}</strong></span>
      </div>
      <p class="mt-2.5 text-[0.82rem] text-muted-foreground">
        이 페이지의 <code>&lt;script setup&gt;</code> 에는 <code>ref</code>/<code>computed</code> import 가
        없습니다. <code>&lt;TopicPage&gt;</code>·<code>&lt;DemoBox&gt;</code> 컴포넌트도 마찬가지입니다.
      </p>
    </DemoBox>

    <div class="key">
      <strong>주의:</strong> 자동 임포트되는 건 <code>app/components</code>,
      <code>app/composables</code>, <code>app/utils</code> 등 <em>정해진 디렉터리</em>뿐입니다.
      <code>~/data/samples</code> 같은 일반 모듈은 지금처럼 직접 import 합니다.
    </div>
  </TopicPage>
</template>
