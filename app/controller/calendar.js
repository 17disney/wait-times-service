'use strict'

const Controller = require('egg').Controller
const moment = require('moment')

class CalendarController extends Controller {
  async list() {
    const { ctx, app } = this
    const { local } = ctx.params

    const date = moment().format('YYYY-MM-DD')
    let data  = await ctx.service.calendar.getLocalDate(local, date)

    if (!data) {
      data = await ctx.service.calendar.cache(local, date)
    } else {
      data = data['data']
    }

    if (!data) {
      let date = moment().subtract(1, 'days').format('YYYY-MM-DD')
      data = await ctx.service.calendar.getLocalDate(local, date)
      data = data['data']
    }

    ctx.body = data
  }
}

module.exports = CalendarController
