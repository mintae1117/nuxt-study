// 10번 토픽(미들웨어 & 에러 처리) 라이브 데모용 라우트 미들웨어.
// definePageMeta({ middleware: 'demo-log' }) 를 선언한 페이지에 진입할 때마다 실행되어
// 이동 기록을 useState 에 쌓는다. (SSR 첫 진입 시엔 서버에서, 이후엔 클라에서 실행)
export default defineNuxtRouteMiddleware((to, from) => {
  const log = useState<string[]>('mw-log', () => [])
  const where = import.meta.server ? '서버' : '클라이언트'
  log.value.unshift(`[${where}에서 실행] ${from.fullPath} → ${to.fullPath}`)
  if (log.value.length > 5) log.value.pop()
})
