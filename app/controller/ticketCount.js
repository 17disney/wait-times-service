const Controller = require('egg').Controller

class TicketCountController extends Controller {
  async list() {
    const { ctx } = this
    let { local = 'shanghai' } = ctx.params
    // let { st, et } = ctx.query


    ctx.body = await service.ticket.getByLocalRang(local, st, et)
  }

}

module.exports = TicketCountController
