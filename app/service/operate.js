'use strict'

const Service = require('egg').Service

class OperateService extends Service {
  async getByLocal(local) {
    const { ctx } = this
    const data = await ctx.model.DsOperate.findOne(
      { local },
      {
        _id: 0
      }
    )
    return data
  }
}

module.exports = OperateService
