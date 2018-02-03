const Service = require('egg').Service

class ParkService extends Service {
  async getByLocalDate(local, date) {
    let find = {
      local,
      date
    }
    const data = await this.ctx.model.DsPark.find(find, {
      _id: 0,
      markList: 0,
      flowList: 0
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
    const data = await this.ctx.model.DsPark.find(find, {
      _id: 0,
      markList: 0,
      flowList: 0
    })
    return data
  }
}

module.exports = ParkService
