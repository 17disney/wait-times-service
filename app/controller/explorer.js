const Controller = require('egg').Controller
const moment = require('moment')
const { lineToObject, objectToLine } = require('../utils/api_tool')
const superAgent = require('superagent')

// 静态资源控制器
class ExplorerController extends Controller {
  // 字典
  async destinationsRaw() {
    const { ctx } = this
    let { local } = ctx.params

    ctx.body = await ctx.service.explorer.destinations.getDestinationsRaw(local)
  }

  async destinations() {
    const { ctx } = this
    const { local } = ctx.params

    const { type } = ctx.query

    if (type) {
      ctx.body = await ctx.service.explorer.destinations.getDestinationsType(
        local,
        type
      )
    } else {
      ctx.body = await ctx.service.explorer.destinations.getDestinations(local)
    }
  }

  async updateDestinationsId() {
    const { ctx } = this
    let { id } = ctx.params
    let data = ctx.request.body

    await ctx.service.explorer.destinations.updateDestinationsId(id, data)
    ctx.body = data
  }
  // 未来时间表
  async schedulesPre() {
    const { ctx } = this
    let today = moment().format('YYYY-MM-DD')
    let { local, date = today } = ctx.params
    let data = await ctx.service.explorer.schedules.getPreByLocalDate(
      local,
      date
    )
    if (data.length === 2) {
      ctx.body = data
    } else {
      throw new Error('时间表未更新')
    }
  }
  // 项目时间表
  async schedulesList() {
    const { ctx } = this
    const { st, et } = ctx.query
    let { id } = ctx.params
    let data = await ctx.service.explorer.schedules.getByRangId(id, st, et)
    ctx.body = data
  }

  async updateAll() {
    const { ctx } = this
    let date = '2017-04-17'
    let today = '2018-03-30'
    while (date !== today) {
      await superAgent.get(
        `http://127.0.0.1:7001/explorer/schedules/shanghai/${date}`
      )
      console.log(date)
      date = moment(date, 'YYYY-MM-DD')
        .add(1, 'days')
        .format('YYYY-MM-DD')
    }
    ctx.body = 'ok'
  }
  // 乐园开放时间
  async schedules() {
    const { ctx } = this
    const { local, date } = ctx.params
    ctx.body = await ctx.service.explorer.schedules.getSchedules(local, date)
  }
}

module.exports = ExplorerController
