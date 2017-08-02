const Koa = require('koa')
const Router = require('koa-router')
const error = require('koa-json-error')
const Scraper = require('./scraper.js')

const app = new Koa()
const router = new Router()

router.get('/shows', async (ctx, next) => {
  let scraper = new Scraper()
  let locations = await scraper.scrape()
  ctx.body = scraper.convertToShowsList(locations)
})

app.use(error(err => {
    return {
      status: err.status,
      error: err.message
    }
}))
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(process.env.PORT || 3000)

