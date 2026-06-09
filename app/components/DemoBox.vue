<script setup lang="ts">
// 라이브 데모(실제로 동작하는 예제)를 감싸는 카드.
defineProps<{ title?: string }>()
</script>

<template>
  <div class="my-4 overflow-hidden rounded-xl border border-border bg-surface">
    <div class="flex items-center gap-2 border-b border-border bg-surface-muted px-3.5 py-2">
      <span class="size-2.5 rounded-full bg-brand ring-[3px] ring-brand-muted" />
      <span class="text-xs font-semibold text-foreground">{{ title ?? '라이브 데모' }}</span>
    </div>
    <div class="p-5">
      <slot />
    </div>
  </div>
</template>
