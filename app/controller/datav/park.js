'use strict'

const Controller = require('egg').Controller
const moment =  require('moment')

class ParkController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.today = moment().format('YYYY-MM-DD')
  }

  async live() {
    const { ctx } = this
    const { local } = ctx.params
    const { slice = 1 } = ctx.query

    ctx.body = await ctx.service.park.getByLocalDate(local, this.today, slice)
  }
}

module.exports = ParkController
