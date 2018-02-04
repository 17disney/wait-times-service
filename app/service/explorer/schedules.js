const Service = require('egg').Service

class SchedulesService extends Service {
  async getByLocalDate(local, date) {
    let find = {
      local,
      date
    }
    const data = await this.ctx.model.ScanSchedules.find(find, {
      _id: 0
    })
    return data
  }
}

module.exports = SchedulesService
