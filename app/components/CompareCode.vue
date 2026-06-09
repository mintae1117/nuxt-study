<script setup lang="ts">
// Nuxt 코드와 (순수) Vue 코드를 나란히 비교해서 보여주는 카드.
// <CodeBlock> 은 app/components 라 자동 임포트된다.
defineProps<{
  nuxt: string
  vue: string
  nuxtLang?: string
  vueLang?: string
}>()
</script>

<template>
  <div class="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
    <div class="min-w-0">
      <span
        class="mb-2 inline-block rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-brand-contrast"
        >Nuxt</span
      >
      <CodeBlock :code="nuxt" :lang="nuxtLang ?? 'vue'" />
    </div>
    <div class="min-w-0">
      <span
        class="mb-2 inline-block rounded-full bg-[#42b883] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#0a0a0a]"
        >Vue (plain)</span
      >
      <CodeBlock :code="vue" :lang="vueLang ?? 'vue'" />
    </div>
  </div>
</template>
