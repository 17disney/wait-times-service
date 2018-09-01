const Service = require('egg').Service

class TicketService extends Service {
  async getByLocalRang(local, st, et) {
    let find = {
      local,
      date: {
        $gte: st,
        $lte: et
      }
    }
    const data = await this.ctx.model.ScanTicket.find(find, {
      _id: 0,
      availableList: 0
    })
    return data
  }

  async getByLocalDate(local, date) {
    let find = {
      local,
      date
    }
    const data = await this.ctx.model.ScanTicket.findOne(find, {
      _id: 0
    })
    return data
  }
}

module.exports = TicketService
