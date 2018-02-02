const Controller = require('egg').Controller

class ExplorerController extends Controller {
  // 演出时间表
  async calendars() {
    const { ctx, service  } = this
    const params = ctx.params
    let { date, local } = params

    let find = {
      date,
      local
    }
    ctx.body = await service.explorer.calendar.findOne(find)
  }

  // 字典
  async destinations() {
    const { ctx, service } = this
    const query = ctx.query
    const params = ctx.params
    let { local } = params
    console.log(local)

    ctx.body = await ctx.service.explorer.destinations.getByLocal(local)
  }
}

module.exports = ExplorerController
