'use strict';

const Controller = require('egg').Controller;

// 等待统计查询
class WaitCountController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.getRule = {
      st: { type: 'date', required: true },
      et: { type: 'date', required: true },
    };

    this.getSortRule = {
      sort: { type: 'enum', values: [ 'wait-avg', 'wait-max' ], required: true },
    };

    this.localRule = {
      local: { type: 'enum', values: [ 'shanghai' ], required: true },
    };
  }
  // 项目等候时间范围查询
  async attractionsId() {
    const { ctx, service } = this;
    const { local, id } = ctx.params;
    const { st, et, sort } = ctx.query;

    let data;
    if (sort) {
      ctx.validate(this.getSortRule, ctx.query);
      data = await service.attraction.getByLocalIdSort(local, id, sort);
    } else {
      ctx.validate(this.getRule, ctx.query);
      data = await service.attraction.getByLocalRangId(local, id, st, et);
      data = service.data.fillDate(st, et, data);
    }

    const list = [];

    data.forEach(item => {
      const {
        date,
        status,
        startTime,
        endTime,
        waitMax,
        waitAvg,
        waitHour,
      } = item;

      list.push({
        date,
        status,
        startTime,
        endTime,
        waitMax,
        waitAvg,
        waitHour,
      });
    });

    ctx.body = list;
  }
  // 乐园等候时间范围查询
  async park() {
    const { ctx, service } = this;
    const { local } = ctx.params;
    const { st, et } = ctx.query;

    ctx.validate(this.localRule, ctx.params);
    ctx.validate(this.getRule, ctx.query);

    const list = [];
    let data = await service.park.getByLocalRang(local, st, et);

    data = service.data.fillDate(st, et, data);

    data.forEach(item => {
      const {
        date,
        allAtt,
        openAtt,
        startTime,
        endTime,
        markAvg,
        markMax,
        flowHour,
        flowMax,
        flowAvg,
        markHour,
        show,
        allFlowDay,
        allMarkDay,
        rankFlowDay,
        rankMarkDay,
      } = item;

      list.push({
        date,
        allAtt,
        openAtt,
        startTime,
        endTime,
        markAvg,
        markMax,
        flowHour,
        flowMax,
        flowAvg,
        markHour,
        show,
        allFlowDay,
        allMarkDay,
        rankFlowDay,
        rankMarkDay,
      });
    });

    ctx.body = list;
  }
}

module.exports = WaitCountController;
