'use strict';

const Service = require('egg').Service;

class OperateService extends Service {
  async getByLocal(local) {
    const data = await this.ctx.model.Ds
    return data
  }
}

module.exports = OperateService;
