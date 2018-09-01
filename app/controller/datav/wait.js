'use strict'

const Controller = require('egg').Controller
const moment = require('moment')
const { lineToObject, getAncestorsName } = require('../../utils/api_tool')

class WaitController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.today = moment().format('YYYY-MM-DD')
  }

  async live() {
    const { ctx } = this
    const { local } = ctx.params
    const { hotLevel: HotLevel = 0, slice = 1} = ctx.query

    const dataDesc = await ctx.service.explorer.destinations.getDestinationsType(
      local,
      'attraction'
    )

    const dataDescLand = await ctx.service.explorer.destinations.getDestinationsType(
      local,
      'land'
    )

    const objDesc = {}
    dataDesc.forEach(item => {
      const { id } = item
      const _id = lineToObject(id).__id__
      objDesc[_id] = item
    })

    const listWaits = await ctx.service.attraction.getByLocalToday(
      local,
      this.today,
      -slice
    )

    const list = []
    listWaits.forEach(item => {
      const { id, startTime, endTime, waitList } = item

      const itemDesc = objDesc[id]
      const {name, hotLevel} = itemDesc

      if (hotLevel < HotLevel) return

      let landName = ''
      if (itemDesc && itemDesc.relatedLocations && itemDesc.relatedLocations[0] && itemDesc.relatedLocations[0].ancestors) {
        const data = itemDesc.relatedLocations[0].ancestors

        const itemDescLand = getAncestorsName(data, 'land', dataDescLand)
        landName = itemDescLand ? itemDescLand.name : '玩具总动员'
      }

      const att = {
        id,
        name,
        hotLevel,
        landName,
        startTime,
        endTime,
        waitList,
        wait: 0
      }

      if (waitList && waitList.length > 0) {
        const [utime, wait, status] = waitList[waitList.length - 1]
        Object.assign(att, {
          utime,
          wait,
          status
        })
      }

      att.waitView = `${att.wait} 分`
      list.push(att)
    })

    ctx.body = list
  }
}

module.exports = WaitController
