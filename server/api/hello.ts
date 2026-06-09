// server/api/hello.ts → GET /api/hello?name=...
// 쿼리 파라미터를 읽어 응답을 만드는 간단한 핸들러.
export default defineEventHandler((event) => {
  const { name } = getQuery(event)
  return {
    message: `안녕하세요, ${name || '익명'} 님! 이 응답은 Nitro 서버에서 생성됐습니다.`,
    at: new Date().toISOString(),
  }
})
