'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const { localList } = require('../utils/park-list');

// 等待时间查询
class WaitTimesController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.today = moment().format('YYYY-MM-DD');

    this.baseRule = {
      date: { type: 'date', required: true },
      local: { type: 'enum', values: localList, required: true },
    };
  }
  // 获取乐园
  async home() {
    const { ctx, service } = this;
    ctx.validate(this.baseRule, ctx.params);

    const { local, date } = ctx.params;

    if (date === this.today) {
      ctx.body = await service.park.getByLocalToday(local);
    } else {
      ctx.body = await service.park.getByLocalDate(local, date);
    }
  }
  // 获取所有项目
  async attractions() {
    const { ctx, service } = this;
    const { raw } = ctx.query;
    ctx.validate(this.baseRule, ctx.params);

    const { date, local } = ctx.params;

    if (raw) {
      ctx.body = await service.attraction.getByLocalDateRaw(local, date);
    } else {
      if (date === this.today) {
        ctx.body = await service.attraction.getByLocalToday(local, date);
      } else {
        ctx.body = await service.attraction.getByLocalDate(local, date);
      }
    }
  }
  // 获取项目详情
  async attractionsId() {
    const { ctx, service } = this;
    const rule = this.baseRule;
    rule.id = { type: 'string', required: true };
    ctx.validate(rule, ctx.params);

    const { date, local, id } = ctx.params;

    ctx.body = await service.attraction.getByLocalDateId(local, date, id);
  }
}

module.exports = WaitTimesController;
