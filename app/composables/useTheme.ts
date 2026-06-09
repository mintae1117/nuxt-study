// 라이트/다크/시스템 테마 토글.
// ★ Nuxt 학습 포인트: 이 코드는 서버(SSR)에서도 실행된다. 서버에는 window/localStorage 가
//   없으므로 `import.meta.client` 가드로 브라우저 전용 API 접근을 감싼다.
//   (순수 Vue SPA 에선 항상 브라우저라 이런 가드가 필요 없었다.)
import { computed, ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'nuxt-study-theme'

function readStored(): ThemeMode {
  if (!import.meta.client) return 'system' // 서버에선 항상 기본값
  const v = localStorage.getItem(STORAGE_KEY)
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
}

function systemPrefersDark(): boolean {
  if (!import.meta.client) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 모듈 스코프 싱글톤 — 어느 컴포넌트에서 useTheme() 를 부르든 같은 상태를 공유한다.
const mode = ref<ThemeMode>(readStored())

function resolveDark(m: ThemeMode): boolean {
  return m === 'dark' || (m === 'system' && systemPrefersDark())
}

function applyToDom() {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('dark', resolveDark(mode.value))
}

let mqlBound = false
function bindSystemListener() {
  if (!import.meta.client || mqlBound) return
  mqlBound = true
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (mode.value === 'system') applyToDom()
  })
}

export function useTheme() {
  bindSystemListener()
  applyToDom()

  function setMode(next: ThemeMode) {
    mode.value = next
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, next)
    applyToDom()
  }

  const isDark = computed(() => resolveDark(mode.value))

  return { mode, setMode, isDark }
}
