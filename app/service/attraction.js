const Service = require('egg').Service

class AttractionService extends Service {
  async findOne(find) {
    const data = await this.ctx.model.ScanCalendar.findOne(find, { _id: 0 })
    return data
  }
}

module.exports = AttractionService
