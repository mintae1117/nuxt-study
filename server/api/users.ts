// server/api/users.ts → GET /api/users
// ★ 이 파일은 server/ 에 있으므로 Nuxt 의 Nitro 서버 엔진에서 실행된다(브라우저 X).
//   풀스택: 같은 프로젝트 안에 백엔드 API 가 산다. 반환값은 자동으로 JSON 직렬화된다.
export default defineEventHandler(() => {
  return [
    { id: 1, name: '민태', role: '풀스택' },
    { id: 2, name: '지현', role: '프론트엔드' },
    { id: 3, name: '상우', role: '백엔드' },
  ]
})
