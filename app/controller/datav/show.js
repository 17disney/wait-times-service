'use strict'

const moment = require('moment')
const Controller = require('egg').Controller
const { compare } = require('../../utils/util')
const { listOpen } = require('../../utils/array')

class ShowController extends Controller {
  async parkShows() {
    const { ctx } = this
    const { local } = ctx.params
    const today = moment().format('YYYY-MM-DD')
    const { date = today } = ctx.query
    const nowX = moment().format('x')
    const dataShow = await ctx.service.explorer.schedules.getSchedules(
      local,
      date
    )
    const dataDesc = await ctx.service.explorer.destinations.getDestinationsType(
      local,
      'entertainment'
    )

    const objDesc = {}
    dataDesc.forEach(item => {
      const { id, name } = item
      objDesc[id] = name
    })

    let list = []
    dataShow.forEach(item => {
      const { id, schedules } = item
      list.push({
        id,
        schedules,
        name: objDesc[id]
      })
    })
    list = list.filter(item => item.name)
    list = listOpen(list, 'schedules')

    list.forEach(item => {
      const { schedules } = item
      const timeX = parseInt(
        moment(`${today} ${schedules}`, 'YYYY-MM-DD HH:mm:ss').format('x')
      )

      const timeDiffX = timeX - nowX
      const timeDiffView = Math.round(timeDiffX / 60000)

      const timeView = moment(schedules, 'HH:mm:ss').format('HH:mm')
      const statusView = timeDiffX > 0 ? timeView : '已结束'

      Object.assign(item, {
        timeX,
        timeDiffX,
        statusView,
        timeDiffView
      })
    })

    list.sort(compare('timeX'))
    ctx.body = list
  }
}

module.exports = ShowController
