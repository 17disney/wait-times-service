'use strict';

const Controller = require('egg').Controller;

class TicketController extends Controller {
  async available() {
    const { ctx, service } = this;
    const { local = 'shanghai' } = ctx.params;
    const { st, et } = ctx.query;
    ctx.body = await service.ticket.getByLocalRang(local, st, et);
  }

  async availableDate() {
    const { ctx, service } = this;
    const { local = 'shanghai', date } = ctx.params;
    ctx.body = await service.ticket.getByLocalDate(local, date);
  }
}

module.exports = TicketController;
