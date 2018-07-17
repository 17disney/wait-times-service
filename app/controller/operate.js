const Controller = require('egg').Controller

class OperateController extends Controller {
  async count() {
    const { ctx } = this

    const { local } = ctx.params

    const data = await this.service.operate.getByLocal(local)
    ctx.body = data
  }
}

module.exports = OperateController
