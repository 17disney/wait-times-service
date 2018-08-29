'use strict'

const Controller = require('egg').Controller
const moment = require('moment')
const { lineToObject } = require('../../utils/api_tool')

class WaitController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.today = moment().format('YYYY-MM-DD')
  }

  async live() {
    const { ctx } = this
    const { local } = ctx.params

    const dataDesc = await ctx.service.explorer.destinations.getDestinationsType(
      local,
      'attraction'
    )

    const objDesc = {}
    dataDesc.forEach(item => {
      const { id } = item
      const _id = lineToObject(id).__id__
      objDesc[_id] = item
    })

    const listWaits = await ctx.service.attraction.getByLocalToday(local, this.today)

    const list = []
    listWaits.forEach(item => {
      const {id, startTime, endTime, waitList} = item

      const att = {
        id,
        name: objDesc[id].name,
        startTime,
        endTime,
        wait: 0
      }

      if (waitList && waitList[0]) {
        const [utime, wait, status] = waitList[0]
        Object.assign(att, {
          utime, wait, status
        })
      }

      att.waitView = `${att.wait} 分`

      list.push(att)
    })

    ctx.body = list
  }
}

module.exports = WaitController
