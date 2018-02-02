const Service = require('egg').Service

class DestinationsService extends Service {
  async getDestinations(local, type) {
    let find = {
      local
    }
    let data = await this.ctx.model.ScanDestination.findOne(find, {
      _id: 0,
      local: 0,
      date: 0
    })

    let destList = []
    for (let item of data.added) {
      if (item.type === type) {
        destList.push(item)
      }
    }

    return destList
  }

  async getFacetGroups(local) {
    let find = {
      local
    }

    let data = await this.ctx.model.ScanDestination.findOne(find, {
      _id: 0,
      local: 0,
      date: 0,
      added: 0
    })

    return data.facetGroups
  }
}

module.exports = DestinationsService
