// server/api/secret.ts → GET /api/secret?token=...
// createError 데모: 토큰이 틀리면 401 에러를 던진다.
// Nitro 가 statusCode 에 맞는 HTTP 응답을 만들고, $fetch 쪽에서는 FetchError 로 잡힌다.
export default defineEventHandler((event) => {
  const { token } = getQuery(event)
  if (token !== 'nuxt') {
    throw createError({
      statusCode: 401,
      statusMessage: 'token 이 틀렸습니다. (정답: nuxt)',
    })
  }
  return { secret: '🎉 통과! 이 메시지는 Nitro 가 지키고 있었습니다.' }
})
