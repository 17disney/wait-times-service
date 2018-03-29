const Controller = require('egg').Controller
const moment = require('moment')
const { lineToObject } = require('../util/api_tool')

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
    let { local } = ctx.params

    ctx.body = await ctx.service.explorer.destinations.getDestinations(local)
  }

  async updateDestinationsId() {
    const { ctx } = this
    let { id } = ctx.params
    let data = ctx.request.body

    await ctx.service.explorer.destinations.updateDestinationsId(id, data)
    ctx.body = data
  }

  // 时间表
  async schedulesPre() {
    const { ctx } = this
    const params = ctx.params
    let today = moment().format('YYYY-MM-DD')
    let { local, date = today } = params

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

  async schedules() {
    const { ctx } = this
    var data
    const params = ctx.params
    let today = moment().format('YYYY-MM-DD')
    let { local, date = today } = params

    data = await ctx.service.explorer.schedules.getByLocalDate(local, date)
    // 更新至新表
    if (data.length === 0) {
      data = await ctx.service.explorer.schedules.getPreByLocalDate(local, date)

      let activities = []
      for (const item of data) {
        activities = activities.concat(item.body[0]['activities'])
      }

      data = []

      for (const item of activities) {
        let { id, schedule } = item
        let type = lineToObject(id)['entityType']
        if (type === 'Entertainment') {
          if (schedule && schedule.schedules) {
            let schedules = schedule.schedules
            if (schedules) {
              schedules = schedules.filter(_ => _.date === date)
              let _data = {
                id,
                schedules
              }
              data.push(_data)
              await ctx.service.explorer.schedules.updateByLocalDateId(
                local,
                date,
                id,
                _data
              )
            }
          }
        }
      }
    }

    ctx.body = data
  }
}

module.exports = ExplorerController
