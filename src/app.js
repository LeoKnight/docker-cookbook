const Koa = require('koa')
const app = new Koa()

app.use(async ctx => {
  console.log('method====>', ctx.request.method, '\nip=====>', ctx.request.ip)
  ctx.body = 'Hello World'
})

app.listen(3000)
