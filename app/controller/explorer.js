const Controller = require('egg').Controller
const moment = require('moment')

// 静态资源控制器
class ExplorerController extends Controller {
  // 字典
  async destinationsRaw() {
    const { ctx } = this
    let { local } = ctx.params

    ctx.body = await ctx.service.explorer.destinations.getDestinationsRaw(local)
  }

  async destinations() {
    const { ctx } = this
    let { local } = ctx.params

    ctx.body = await ctx.service.explorer.destinations.getDestinations(local)
  }

  async updateDestinationsId() {
    const { ctx } = this
    let { id } = ctx.params
    let data = ctx.request.body

    await ctx.service.explorer.destinations.updateDestinationsId(id, data)
    ctx.body = data
  }

  // 时间表
  async schedules() {
    const { ctx } = this
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
