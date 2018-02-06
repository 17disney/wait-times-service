const Controller = require('egg').Controller

// 静态资源控制器
class ExplorerController extends Controller {
  // 字典
  async destinations() {
    const { ctx, service } = this
    const query = ctx.query
    const params = ctx.params
    let { local } = params
    let { type } = ctx.query

    ctx.body = await ctx.service.explorer.destinations.getDestinations(
      local,
      type
    )
  }

  // 字典
  async destinations() {
    const { ctx, service } = this
    const query = ctx.query
    const params = ctx.params
    let { local } = params
    let { type } = ctx.query

    ctx.body = await ctx.service.explorer.destinations.getDestinations(
      local,
      type
    )
  }

  async facetGroups() {
    const { ctx, service } = this
    const query = ctx.query
    const params = ctx.params
    let { local } = params
    let { type } = ctx.query

    ctx.body = await ctx.service.explorer.destinations.getFacetGroups(local)
  }

  async schedules() {
    const { ctx, service } = this
    const params = ctx.params
    let { local, date } = params

    ctx.body = await ctx.service.explorer.schedules.getByLocalDate(local, date)
  }
}

module.exports = ExplorerController
