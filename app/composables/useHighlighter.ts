// shiki 를 "fine-grained" 방식으로 구성 — 쓰는 테마/언어만 import 해 번들을 줄인다.
// 이 파일은 app/composables/ 에 있으므로 Nuxt 가 자동 임포트한다. (import 문 불필요)
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

import githubLight from '@shikijs/themes/github-light'
import githubDark from '@shikijs/themes/github-dark'
import vue from '@shikijs/langs/vue'
import ts from '@shikijs/langs/typescript'
import bash from '@shikijs/langs/bash'

// 앱 전체에서 단 한 번만 생성해 공유하는 싱글톤.
let highlighterPromise: Promise<HighlighterCore> | null = null

export const SHIKI_THEMES = { light: 'github-light', dark: 'github-dark' } as const

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubLight, githubDark],
      langs: [vue, ts, bash],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    })
  }
  return highlighterPromise
}
