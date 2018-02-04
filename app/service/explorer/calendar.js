const Service = require('egg').Service

class CalendarService extends Service {
  async getByLocalDate(local, date) {
    let find = {
      local,
      date
    }
    const data = await this.ctx.model.ScanCalendar.findOne(find, { _id: 0 })
    return data
  }
}

module.exports = CalendarService
