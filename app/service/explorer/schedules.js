const Service = require('egg').Service

class SchedulesService extends Service {
  async getPreByLocalDate(local, date) {
    let find = {
      local,
      date
    }
    const data = await this.ctx.model.ScanSchedules.find(find, {
      _id: 0
    })

    return data
  }
  async getByLocalDate(local, date) {
    let find = {
      local,
      date
    }
    const data = await this.ctx.model.DsSchedules.find(find, {
      _id: 0,
      date: 0,
      local: 0
    })
    return data
  }

  async getByRangId(id, st, et) {
    let find = {
      id,
      date: {
        $gte: st,
        $lte: et
      }
    }

    let data = await this.ctx.model.DsSchedules.find(find, {
      _id: 0,
      id: 0,
      local: 0
    }).sort({ date: 1 })
    return data
  }

  async updateByLocalDateId(local, date, id, data) {
    let find = {
      local,
      date,
      id
    }
    let ret = await this.ctx.model.DsSchedules.update(
      find,
      {
        $set: data
      },
      {
        upsert: true
      }
    )

    return ret
  }
}

module.exports = SchedulesService
