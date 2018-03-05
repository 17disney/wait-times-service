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

  // 获取最新
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
    }).sort({ date: -1 })
    return data
  }

  // 按项目ID日期查询
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

  // 项目日期范围查找
  async getByLocalRangId(local, id, st, et, sort) {
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
    }).sort({ date: -1 })
    return data
  }

  // 项目范围排序
  async getByLocalIdSort(local, id, sort_type) {
    let find = {
      local,
      id
    }

    let sort
    if (sort_type === 'wait-avg') {
      sort = { waitAvg: -1 }
    } else if (sort_type === 'wait-max') {
      sort = { waitMax: -1 }
    }

    let data = await this.ctx.model.DsAttraction.find(find, {
      _id: 0,
      id: 0,
      waitList: 0,
      fpList: 0,
      schedule: 0,
      waitMaxList: 0
    })
      .sort(sort)
      .limit(20)

    return data
  }
}

module.exports = AttractionService
