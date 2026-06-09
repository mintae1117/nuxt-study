<script setup lang="ts">
import { useTheme, type ThemeMode } from '~/composables/useTheme'

const { mode, setMode } = useTheme()

const options: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
  { value: 'system', label: '시스템' },
]
</script>

<template>
  <!-- ClientOnly: 테마 상태는 브라우저(localStorage/OS)에 의존하므로 서버-클라이언트
       마크업 불일치(hydration mismatch)를 피하려 클라이언트에서만 렌더한다. -->
  <ClientOnly>
    <div
      class="inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface-muted p-0.5"
      role="radiogroup"
      aria-label="테마 선택"
    >
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        role="radio"
        :aria-checked="mode === opt.value"
        :title="opt.label"
        class="rounded-md px-2 py-1 text-xs font-medium transition-colors"
        :class="
          mode === opt.value
            ? 'bg-background text-brand shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        "
        @click="setMode(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </ClientOnly>
</template>
