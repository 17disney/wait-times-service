'use strict'

const moment = require('moment')
const Controller = require('egg').Controller

function listOpen(list, key) {
  const nList = []
  list.forEach(item => {
    const cList = item[key]
    cList.forEach(child => {
      delete item[key]
      item[key] = child
      nList.push(item)
    })
  })
  return nList
}

function compare(property) {
  return function(a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value1 - value2
  }
}

class DatavController extends Controller {
  async parkShows() {
    const { ctx } = this
    const { local } = ctx.params
    const today = moment().format('YYYY-MM-DD')
    const nowX = moment().format('x')

    const dataShow = await ctx.service.explorer.schedules.getByLocalDate(
      local,
      today
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

    list = listOpen(list, 'schedules')
    list = list.filter(item => item.name)

    list.forEach(item => {
      const { schedules } = item
      const timeX = parseInt(moment(
        `${today} ${schedules}`,
        'YYYY-MM-DD HH:mm:ss'
      ).format('x'))

      const timeDiffX = timeX - nowX
      const timeDiffView = Math.round(timeDiffX / 60000)
      const statusView = timeDiffX > 0 ? `${timeDiffView}分后开始` : '已结束'

      Object.assign(item, {
        timeX,
        timeDiffX,
        statusView
      })
    })

    list.sort(compare('timeX'))
    ctx.body = list
  }
}

module.exports = DatavController
