<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
// getHighlighter / SHIKI_THEMES 는 app/composables 라 자동 임포트되지만,
// 명시적으로 적어도 동작한다. (학습용이라 의도를 드러내기 위해 그대로 둠)
import { getHighlighter, SHIKI_THEMES } from '~/composables/useHighlighter'

const props = withDefaults(defineProps<{ code: string; lang?: string }>(), {
  lang: 'ts',
})

const html = ref('')

async function highlight() {
  const highlighter = await getHighlighter()
  html.value = highlighter.codeToHtml(props.code.trim(), {
    lang: props.lang,
    themes: SHIKI_THEMES,
  })
}

// ★ Nuxt 학습 포인트: shiki 는 wasm 기반이라 SSR 단계 대신 클라이언트 마운트 후 실행한다.
// onMounted 는 Nuxt 에서 브라우저에서만 호출되므로 서버 렌더 부담이 없다.
onMounted(highlight)
watch(() => [props.code, props.lang], highlight)
</script>

<template>
  <!-- 하이라이팅 전(서버 렌더/하이드레이션 직후)에는 plain 코드 폴백 -->
  <div v-if="html" v-html="html" />
  <pre v-else class="shiki"><code>{{ code.trim() }}</code></pre>
</template>
