const Controller = require('egg').Controller

// 等待统计查询
class WaitCountController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.getRule = {
      st: { type: 'date', required: true },
      et: { type: 'date', required: true }
    }

    this.getSortRule = {
      sort: { type: 'enum', values: ['wait-avg', 'wait-max'], required: true }
    }

    this.localRule = {
      local: { type: 'enum', values: ['shanghai'], required: true }
    }
  }

  async attractionsId() {
    const { ctx, service } = this
    let { local, id } = ctx.params
    let { st, et, sort } = ctx.query

    if (sort) {
      ctx.validate(this.getSortRule, ctx.query)
      ctx.body = await service.attraction.getByLocalIdSort(local, id, sort)
    } else {
      ctx.validate(this.getRule, ctx.query)
      ctx.body = await service.attraction.getByLocalRangId(local, id, st, et)
    }
  }

  async park() {
    const { ctx, service } = this
    let { local } = ctx.params
    let { st, et } = ctx.query
    let find = {
      local,
      st,
      et
    }

    ctx.validate(this.localRule, ctx.params)
    ctx.validate(this.getRule, ctx.query)

    ctx.body = await service.park.getByLocalRang(local, st, et)
  }
}

module.exports = WaitCountController
