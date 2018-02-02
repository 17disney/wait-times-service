const Controller = require('egg').Controller

// 项目查询
class AttractionController extends Controller {
  async index() {
    const { ctx, service } = this
    const params = ctx.params
    let { date, local } = params
    console.log(service.attraction)
    ctx.body = await service.attraction.getByDate(local, date)
  }

  async search() {
    const { ctx, service } = this
    const params = ctx.params
    let { date, local } = params

    let find = {
      date,
      local
    }
    ctx.body = await service.explorer.calendar.findOne(find)
  }
}

module.exports = AttractionController
