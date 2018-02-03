const Service = require('egg').Service

class TicketService extends Service {
  // 按地址日期查询所有项目
  async getByLocalDate(local, date) {
    let find = {
      local,
      date
    }
    const data = await this.ctx.model.ScanTicket.find(find, {
      _id: 0,
      waitList: 0,
      waitMaxList: 0,
      fpList: 0,
      schedule: 0
    })
    return data
  }

}

module.exports = TicketService
