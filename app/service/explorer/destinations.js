const Service = require('egg').Service

class DestinationsService extends Service {
  async getByLocal(local) {
    let find = {
      local
    }
    let data = await this.ctx.model.ScanDestination.findOne(find, {
      _id: 0,
      local: 0,
      date: 0
    })

    return data
  }
}

module.exports = DestinationsService
