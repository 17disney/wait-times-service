'use strict';

const Service = require('egg').Service;

class DestinationsService extends Service {
  async getDestinationsRaw(local) {
    const find = {
      local,
    };
    const data = await this.ctx.model.ScanDestinations.findOne(find, {
      _id: 0,
      local: 0,
      // date: 0
    }).sort({ date: -1 });

    return data;
  }

  async getDestinations(local) {
    const find = {
      local,
    };
    const data = await this.ctx.model.DsDestinations.find(find, {
      _id: 0,
      local: 0,
      date: 0,
    });

    return data;
  }

  async getDestinationsType(local, type) {
    const find = {
      local,
      type,
    };
    const data = await this.ctx.model.DsDestinations.find(find, {
      _id: 0,
      local: 0,
      date: 0,
    });
    return data;
  }

  async updateDestinationsId(id, data) {
    const find = {
      id,
    };
    const ret = await this.ctx.model.DsDestinations.update(
      find,
      {
        $set: data,
      },
      {
        upsert: true,
      }
    );

    return ret;
  }
}

module.exports = DestinationsService;
