const Controller = require('egg').Controller

// 项目查询
class AttractionController extends Controller {
  async index() {
    const { ctx, service } = this
    let { id = 'all' } = ctx.query
    let { date, local } = ctx.params

    if (id === 'all') {
      // 查询所有
      ctx.body = await service.attraction.getAllByDate(local, date)
    } else {
      // 查询单独项目
      ctx.body = await service.attraction.getById(local, date, id)
    }
  }

  // 项目范围查找
  async search() {
    const { ctx, service } = this
    let { date, local } = ctx.params
    let { id, st, et } = ctx.query
    let find = {
      date,
      local,
      id
    }
    ctx.body = await service.attraction.getRangById(local, date, id, st, et)
  }
}

module.exports = AttractionController
