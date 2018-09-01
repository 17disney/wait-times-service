'use strict'

const Controller = require('egg').Controller
const moment = require('moment')

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

  async liveId() {
    const { ctx } = this
    const { local, id } = ctx.params
    const { slice = 50 } = ctx.query

    const data = await ctx.service.park.getByLocalDate(local, this.today, slice)
    const list = data[id]

    const nList = []
    list.forEach(item => {
      const [utime, num] = item

      item = {
        utime,
        num
      }
      nList.push(item)
    })

    ctx.body = nList
  }
}

module.exports = ParkController
