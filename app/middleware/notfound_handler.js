module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    await next()
    if (ctx.status === 404 && !ctx.body) {
      ctx.body = { massage: 'Not Api', error: 404 }
    }
  }
}
