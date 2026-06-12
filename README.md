# Nuxt ↔ Vue 학습 노트

🔗 **라이브 데모: [nuxt-study-for-me.netlify.app](https://nuxt-study-for-me.netlify.app/)**

**이미 Vue 3 (Composition API)를 아는 사람**을 위한 Nuxt 비교 학습 가이드입니다.
"Nuxt 가 순수 Vue 위에 무엇을 더 얹어주는가"를 주제별로 **개념 설명 · 라이브 데모 · Nuxt vs Vue 코드 비교**로 정리했습니다.

**React / Next.js 에서 넘어오는 사람**을 위한 내용도 들어 있습니다 — 토픽 09(하이드레이션 & 클라이언트 코드), 10(미들웨어 & 에러 처리), 11(Next.js → Nuxt 이주 가이드 대응표)과 각 토픽의 "Next.js 개발자라면" 비교 박스를 참고하세요.

> 자매 프로젝트인 [`vue-study`](../vue-study)(React 개발자를 위한 Vue 비교 가이드)의 형식을 그대로 따왔고, 테마도 동일하게 사용합니다.

## 핵심 컨셉: 앱 자체가 Nuxt 데모

이 학습 앱은 설명하는 기능을 **실제로 사용해서** 만들어졌습니다.

- 사이드바 = `app/layouts/default.vue` (레이아웃 시스템)
- 각 토픽 페이지 = `app/pages/*.vue` (파일 기반 라우팅)
- 코드 비교 카드 = 자동 임포트된 `<CompareCode>` 컴포넌트
- 데이터 페칭 페이지 = 실제 `server/api` (Nitro) 호출
- 각 페이지 제목 = `useSeoMeta` 로 SSR 단계에 설정

## 학습 토픽 (11개)

| # | 토픽 | 핵심 비교 |
|---|------|----------------------|
| 1 | 파일 기반 라우팅 | `pages/` 자동 생성 ↔ `vue-router` 수동 설정 |
| 2 | 자동 임포트 | import 불필요 ↔ 매번 `import` |
| 3 | 레이아웃 시스템 | `layouts/` + `<NuxtLayout>` ↔ 직접 래핑 |
| 4 | 데이터 페칭 | `useFetch` / `useAsyncData` (SSR) ↔ `onMounted` + `fetch` (CSR) |
| 5 | 렌더링 모드 | SSR / SSG / SPA / 하이브리드 ↔ CSR 고정 |
| 6 | SEO & 메타 | `useHead` / `useSeoMeta` ↔ 라이브러리 필요 |
| 7 | 서버 라우트 (Nitro) | `server/api` 풀스택 ↔ 별도 백엔드 |
| 8 | 상태 공유 | `useState` (요청 격리) ↔ `ref` 모듈 싱글톤 (SSR 오염 위험) |
| 9 | 하이드레이션 & 클라이언트 코드 | universal 컴포넌트 / `<ClientOnly>` ↔ `'use client'` / `dynamic(ssr:false)` |
| 10 | 미들웨어 & 에러 처리 | `middleware/` + `error.vue` + `createError` ↔ `middleware.ts` + `error.tsx` |
| 11 | Next.js → Nuxt 이주 가이드 | App Router 규약 ↔ Nuxt 규약 대응표 · `runtimeConfig` ↔ `NEXT_PUBLIC_*` |

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Nuxt 4 (Vue 3.5, Nitro 2, Vite 7) |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/vite`) + CSS 변수 테마 토큰 |
| 코드 하이라이팅 | Shiki (fine-grained core, 듀얼 테마) |
| 다크 모드 | 클래스 기반(`.dark`) + 무-플래시(FOUC 방지) 인라인 스크립트 |

## 프로젝트 구조

```
nuxt-study/
├─ nuxt.config.ts          # Tailwind vite 플러그인, 전역 head, FOUC 방지 스크립트, runtimeConfig
├─ server/api/
│  ├─ users.ts             # GET /api/users  (Nitro 풀스택 데모)
│  ├─ hello.ts             # GET /api/hello  (쿼리 파라미터 데모)
│  └─ secret.ts            # GET /api/secret (createError 401 데모)
└─ app/
   ├─ app.vue              # <NuxtLayout><NuxtPage/>
   ├─ layouts/default.vue  # 사이드바 레이아웃
   ├─ middleware/
   │  └─ demo-log.ts        # 라우트 미들웨어 라이브 데모 (10번 토픽)
   ├─ assets/css/
   │  ├─ base.css          # 디자인 토큰(라이트/다크)
   │  └─ main.css          # Tailwind + shiki + prose 스타일
   ├─ composables/         # (자동 임포트)
   │  ├─ useTheme.ts        #   SSR 안전 테마 토글
   │  └─ useHighlighter.ts  #   shiki 싱글톤
   ├─ components/          # (자동 임포트)
   │  ├─ TopicPage.vue / CompareCode.vue / CodeBlock.vue
   │  ├─ DemoBox.vue / ThemeToggle.vue
   ├─ data/
   │  ├─ topics.ts          # 사이드바 메뉴 목록
   │  └─ samples.ts         # Nuxt vs Vue 코드 비교 문자열
   └─ pages/               # 파일 기반 라우팅 (= 라우트 자동 생성)
      ├─ index.vue          # 개요 / 멘탈 모델 매핑
      ├─ routing.vue        ├─ auto-imports.vue ├─ layouts.vue
      ├─ data-fetching.vue  ├─ rendering.vue    ├─ seo.vue
      ├─ server.vue         ├─ state.vue        ├─ hydration.vue
      ├─ middleware.vue     └─ nextjs.vue
```

> `server/` 와 `nuxt.config.ts` 는 Nuxt 규약상 프로젝트 루트에 위치합니다. 학습 콘텐츠 본체는 모두 `app/` 안에 있습니다.

## 구현 메모

- **다크모드 깜빡임(FOUC) 방지**: SSR 은 사용자 테마(localStorage)를 모른 채 라이트로 HTML 을 보내므로, `nuxt.config.ts` 의 `app.head.script` 에 **페인트 차단 인라인 스크립트**를 `<head>` 에 주입해 첫 페인트 전에 `<html>.dark` 를 적용한다. 이 스크립트의 판정 로직은 `app/composables/useTheme.ts` 와 항상 동일하게 유지할 것.
- **코드 하이라이팅**: shiki 는 wasm 기반이라 SSR 대신 클라이언트 마운트(`onMounted`) 후 실행하고, 그 전에는 plain `<pre>` 로 폴백한다.

## 로컬 실행

```bash
npm install
npm run dev        # 개발 서버 (http://localhost:3000)
```
