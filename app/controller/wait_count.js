const Controller = require('egg').Controller

// 等待统计查询
class WaitCountController extends Controller {
  async park() {
    const { ctx, service } = this
    let { local } = ctx.params
    let { st, et } = ctx.query
    let find = {
      local,
      st,
      et
    }
    ctx.body = await service.park.getByLocalRang(local, st, et)
  }

  async attractionsId() {
    const { ctx, service } = this
    let { local, id } = ctx.params
    let { st, et } = ctx.query
    ctx.body = await service.attraction.getByLocalRangId(local, id, st, et)
  }
}

module.exports = WaitCountController
