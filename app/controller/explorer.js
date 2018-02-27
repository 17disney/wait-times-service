const Controller = require('egg').Controller
const moment = require('moment')

// 静态资源控制器
class ExplorerController extends Controller {
  // 字典
  async destinations() {
    const { ctx, service } = this
    let { local } = ctx.params
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
    let today = moment().format('YYYY-MM-DD')
    let { local, date = today } = params

    let data = await ctx.service.explorer.schedules.getByLocalDate(local, date)
    if (data.length === 2) {
      ctx.body = data
    } else {
      throw new Error('时间表未更新')
    }
  }
}

module.exports = ExplorerController
