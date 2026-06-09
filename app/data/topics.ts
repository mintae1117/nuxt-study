// 사이드바 네비게이션용 토픽 목록.
// ★ vue-study 와 다른 점: 여기엔 component/route 정보가 없다.
//   Nuxt 는 app/pages/ 의 파일명으로 라우트를 자동 생성하므로
//   라우트를 코드로 정의할 필요가 없다. 이 배열은 '메뉴 표시'에만 쓰인다.
export interface Topic {
  no: number
  path: string
  title: string
  summary: string
}

export const topics: Topic[] = [
  {
    no: 1,
    path: '/routing',
    title: '파일 기반 라우팅',
    summary: 'pages/ 디렉터리 vs vue-router 수동 설정',
  },
  {
    no: 2,
    path: '/auto-imports',
    title: '자동 임포트',
    summary: 'ref/컴포넌트/composable 자동 vs 매번 import',
  },
  {
    no: 3,
    path: '/layouts',
    title: '레이아웃 시스템',
    summary: 'layouts/ + <NuxtLayout> vs 직접 래핑',
  },
  {
    no: 4,
    path: '/data-fetching',
    title: '데이터 페칭',
    summary: 'useFetch / useAsyncData vs onMounted + fetch',
  },
  {
    no: 5,
    path: '/rendering',
    title: '렌더링 모드',
    summary: 'SSR / SSG / SPA / 하이브리드 vs CSR 고정',
  },
  {
    no: 6,
    path: '/seo',
    title: 'SEO & 메타 태그',
    summary: 'useHead / useSeoMeta vs 라이브러리 필요',
  },
  {
    no: 7,
    path: '/server',
    title: '서버 라우트 (Nitro)',
    summary: 'server/api 풀스택 vs 별도 백엔드',
  },
  {
    no: 8,
    path: '/state',
    title: '상태 공유',
    summary: 'useState (SSR 안전) vs ref 모듈 싱글톤',
  },
]
