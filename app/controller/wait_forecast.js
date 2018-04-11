const Controller = require('egg').Controller
const moment = require('moment')
const { localList } = require('../utils/park-list')

// 等待时间查询
class WaitForecastController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.today = moment().format('YYYY-MM-DD')

    this.baseRule = {
      date: { type: 'date', required: true },
      local: { type: 'enum', values: localList, required: true }
    }
  }

  async park() {
    const { ctx, service } = this
    const data = ctx.query
    let { flowFt, flowMath, markFt, markMath } = data
    let { local, date } = ctx.params

    ctx.validate(this.baseRule, ctx.params)

    let find = {
      local,
      date
    }
    let update = {
      flowFt,
      flowMath,
      markFt,
      markMath
    }
    ctx.body = await service.park.updateByLocalDate(find, update)
  }

  // async attraction() {
  //   const { ctx, service } = this
  // }
}

module.exports = WaitForecastController
