const Controller = require('egg').Controller

class WaitTimesController extends Controller {
  async park() {
    const { ctx, service } = this
    let { date, local } = ctx.params

    ctx.body = await service.park.getByLocalDate(local, date)
  }

  async attractionsId() {
    const { ctx, service } = this
    let { date, local, id} = ctx.params
    let find = {
      date,
      local,
      id
    }
    ctx.body = await service.attraction.getByLocalDateId(local, date, id)
  }

  async attractions() {
    const { ctx, service } = this
    let { date, local} = ctx.params
    let find = {
      date,
      local,
      id
    }
    ctx.body = await service.attraction.getByLocalDate(local, date)
  }
}

module.exports = WaitTimesController
