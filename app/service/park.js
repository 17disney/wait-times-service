const Service = require('egg').Service
const moment = require('moment')

class ParkService extends Service {
  async getByLocalDate(local, date) {
    let find = {
      local,
      date
    }
    let data = await this.ctx.model.DsPark.findOne(find, {
      _id: 0,
      markList: 0,
      flowList: 0
    })
    return data
  }

  async getByLocalToday(local, date) {
    let find = {
      local,
      date
    }
    let data = await this.ctx.model.DsPark.findOne(find, {
      _id: 0,
      markList: { $slice: -1 },
      flowList: { $slice: -1 }
    })
    return data
  }

  // 项目范围查找
  async getByLocalRang(local, st, et) {
    let find = {
      local,
      date: {
        $gte: st,
        $lte: et
      }
    }
    let data = await this.ctx.model.DsPark.find(find, {
      _id: 0,
      markList: 0,
      flowList: 0
    })
    return data
  }
}

module.exports = ParkService
