'use strict'

const Service = require('egg').Service
const { lineToObject } = require('../utils/api_tool')

class CalendarService extends Service {
  async getLocalDate(local, date) {
    const { ctx } = this
    const data = await ctx.model.DsCalendar.findOne({
      local,
      date
    }, {
      _id: 0
    })
    return data
  }

  async cache(local, date) {
    const { ctx } = this
    const find = {
      local,
      date
    }

    const LIST = [
      'entGoldenFairytaleFanfare', // 金色童话盛典
      'entFrozenSingAlongCelebration', // 冰雪奇缘：欢唱盛会
      'entEyeOfStormCaptainJacksSpectacular', // 风暴来临:杰克船长之惊天特技大冒险
      'entTarzanCallOfJungle', // 人猿泰山：丛林的呼唤
      'entBaymaxSuperExerciseExpo', // 大白超酷活力秀
      'entClubDestinE', // 明日世界E空间聚乐部
      'entMickeysStorybookExpress', // 米奇童话专列
      'entIgniteDreamNighttimeSpectacular' // 点亮奇梦：夜光幻影秀
    ]

    const destinationsList = await ctx.service.explorer.destinations.getDestinationsType(
      local,
      'entertainment'
    )

    const destinations = {}
    destinationsList.forEach(item => {
      const aid = lineToObject(item.id)['__id__']
      destinations[aid] = item
    })

    let schedulesList = await ctx.service.explorer.schedules.getPreByLocalDate(
      local,
      date
    )

    let schedules
    if (schedulesList.length === 2) {
      schedules = this._schedulesFilter(schedulesList)
    } else {
      return false
    }

    const nList = []
    LIST.forEach(id => {
      let destination = destinations[id]
      let schedule = schedules[id]

      nList.push({
        destination,
        schedule
      })
    })

    const update = {
      local,
      date,
      data: nList
    }

    await ctx.model.DsCalendar.update(
      find,
      {
        $set: update
      },
      {
        upsert: true
      }
    )

    return nList
  }

  _schedulesFilter(data) {
    let activities = []
    for (const item of data) {
      activities = activities.concat(item.body[0].activities)
    }

    const nData = {}
    activities.forEach(item => {
      const aid = lineToObject(item.id)['__id__']
      if (item.schedule && item.schedule.schedules) {
        nData[aid] = item.schedule.schedules
      }
    })
    return nData
  }
}

module.exports = CalendarService
