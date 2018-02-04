const Controller = require('egg').Controller
const moment = require('moment')

class WaitTimesController extends Controller {
  async park() {
    const { ctx, service } = this
    let { date, local } = ctx.params

    ctx.body = await service.park.getByLocalDate(local, date)
  }

  async attractionsId() {
    const { ctx, service } = this
    let { date, local, id } = ctx.params
    let find = {
      date,
      local,
      id
    }
    ctx.body = await service.attraction.getByLocalDateId(local, date, id)
  }

  async attractions() {
    const { ctx, service } = this

    let { date, local } = ctx.params
    let find = {
      date,
      local
    }

    let data
    const today = moment().format('YYYY-MM-DD')
    if (date === today) {
      data = await service.attraction.getByLocalToday(local, date)
    } else {
      data = await service.attraction.getByLocalDate(local, date)
    }

    ctx.body = data
  }
}

module.exports = WaitTimesController
