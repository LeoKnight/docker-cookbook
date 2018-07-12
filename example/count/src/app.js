const Koa = require('koa')
const app = new Koa()

let count = 0

app.use(async ctx => {
  ctx.body = `该网页被访问了${count++}次`
})

app.listen(3000)
