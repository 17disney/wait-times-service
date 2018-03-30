const Controller = require('egg').Controller
const moment = require('moment')
const { lineToObject, objectToLine } = require('../util/api_tool')
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

    console.log(date)

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
    // 从原始时间表查找并更新至新表
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
              schedules = schedules.map(_ => _.startTime)
              if (schedules.length > 0) {
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
    }

    // 从旧数据库查找并更新至新表
    if (data.length === 0) {
      let _date = moment(date, 'YYYY-MM-DD')
        .subtract(1, 'days')
        .format('YYYY-MM-DD')
      data = await superAgent.get(
        `http://weather.17disney.com/tp/api/schedules/${_date}`
      )
      let schedules = data.body.data
      data = []

      for (const item of schedules) {
        let { name, type, time_list } = item
        if (type === 4) {
          let ids = {
            __id__: name,
            entityType: 'Entertainment',
            destination: 'shdr'
          }
          let id = objectToLine(ids)
          let timeList = time_list.filter(_ => _.date === date)
          schedules = timeList.map(_ => _.start_time)

          if (schedules.length > 0) {
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

    ctx.body = data
  }
}

module.exports = ExplorerController
