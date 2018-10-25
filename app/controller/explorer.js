'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const superAgent = require('superagent');

// 静态资源控制
class ExplorerController extends Controller {
  // 字典
  async destinationsRaw() {
    const { ctx } = this;
    const { local } = ctx.params;

    ctx.body = await ctx.service.explorer.destinations.getDestinationsRaw(local);
  }
  // 简介列表
  async destinations() {
    const { ctx } = this;
    const { local } = ctx.params;

    const { type } = ctx.query;

    if (type) {
      ctx.body = await ctx.service.explorer.destinations.getDestinationsType(
        local,
        type
      );
    } else {
      ctx.body = await ctx.service.explorer.destinations.getDestinations(local);
    }
  }

  async updateDestinationsId() {
    const { ctx } = this;
    const { id } = ctx.params;
    const data = ctx.request.body;

    await ctx.service.explorer.destinations.updateDestinationsId(id, data);
    ctx.body = data;
  }
  // 预报
  async schedulesPre() {
    const { ctx } = this;
    const today = moment().format('YYYY-MM-DD');
    const { local, date = today } = ctx.params;
    const data = await ctx.service.explorer.schedules.getPreByLocalDate(
      local,
      date
    );
    if (data.length === 2) {
      ctx.body = data;
    } else {
      throw new Error('时间表未更新');
    }
  }
  // 项目时间表
  async schedulesList() {
    const { ctx } = this;
    const { st, et } = ctx.query;
    const { id } = ctx.params;
    const data = await ctx.service.explorer.schedules.getByRangId(id, st, et);
    ctx.body = data;
  }
  // 更新脚本
  async updateAll() {
    const { ctx } = this;
    let date = '2017-04-17';
    const today = '2018-03-30';
    while (date !== today) {
      await superAgent.get(
        `http://127.0.0.1:7001/explorer/schedules/shanghai/${date}`
      );
      date = moment(date, 'YYYY-MM-DD')
        .add(1, 'days')
        .format('YYYY-MM-DD');
    }
    ctx.body = 'ok';
  }
  // 乐园开放时间
  async schedules() {
    const { ctx } = this;
    const { local, date } = ctx.params;
    ctx.body = await ctx.service.explorer.schedules.getSchedules(local, date);
  }
}

module.exports = ExplorerController;
