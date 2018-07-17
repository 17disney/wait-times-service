const Controller = require('egg').Controller

class OperateController extends Controller {
  async count() {
    const { ctx, service } = this
    const { local } = ctx.params

    const data = await service.operate.getByLocal(local)
    ctx.body = data
  }
}

module.exports = OperateController
