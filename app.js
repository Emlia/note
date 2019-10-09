const Koa = require('koa');
const logger = require('koa-logger');
const static = require('koa-static')
const path = require('path')

const app = new Koa();
const port = 4444

// 日志
app.use(logger())

//设置静态资源的路径 
const staticPath = './'
// 静态服务器
app.use(static(
  path.join(__dirname, staticPath)
))

// error
app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});

app.listen(port);
console.log(`serve is running at: http://localhost:${port}`)