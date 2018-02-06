const Service = require('egg').Service

class AttractionService extends Service {
  // 按地址日期查询所有项目
  async getByLocalDate(local, date) {
    let find = {
      local,
      date
    }
    let data = await this.ctx.model.DsAttraction.find(find, {
      _id: 0,
      waitList: 0,
      waitMaxList: 0,
      fpList: 0,
      schedule: 0
    })
    return data
  }

  async getByLocalToday(local, date) {
    let find = {
      local,
      date
    }
    let data = await this.ctx.model.DsAttraction.find(find, {
      _id: 0,
      waitList: { $slice: -1 },
      waitMaxList: 0,
      fpList: { $slice: -1 },
      schedule: 0
    })
    return data
  }

  // 按地址日期ID查询项目
  async getByLocalDateId(local, date, id) {
    let find = {
      local,
      date,
      id
    }
    let data = await this.ctx.model.DsAttraction.findOne(find, {
      _id: 0,
      schedule: 0
    })
    return data
  }

  // 项目范围查找
  async getByLocalRangId(local, id, st, et) {
    let find = {
      local,
      id,
      date: {
        $gte: st,
        $lte: et
      }
    }
    let data = await this.ctx.model.DsAttraction.find(find, {
      _id: 0,
      id: 0,
      waitList: 0,
      fpList: 0,
      schedule: 0,
      waitMaxList: 0
    })
    return data
  }
}

module.exports = AttractionService
