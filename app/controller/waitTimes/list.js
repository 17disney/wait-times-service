module.exports = app => {
  class Controller extends app.Controller {
    constructor(ctx) {
      super(ctx);
      this.paramsBase = {
        type: { type: 'enum', values: [ 'date', 'daterange' ], required: true },
      };
      this.paramsRule = {
        date: {
          date: { type: 'date', required: true },
          granularity: { type: 'enum', values: [ 'hour', '10m' ], required: true },
        },
        daterange: {
          startDate: { type: 'date', required: true },
          endDate: { type: 'date', required: true },
        },
      };
    }

    async dest() {
      const { date, startDate, endDate, type, granularity = 'hour' } = this.ctx.query;
      const { dest = 'shdr' } = this.ctx.params;
      this.ctx.validate(this.paramsBase, this.ctx.query);
      this.ctx.validate(this.paramsRule[type], this.ctx.query);

      const params = {
        dest,
        type,
      };

      if (type === 'date') {
        params.date = date;
        params.granularity = granularity;
        this.ctx.body = await this.ctx.service.waitTimes.list.getByDestDate(params);
      } else if (type === 'daterange') {
        params.startDate = startDate;
        params.endDate = endDate;
        this.ctx.body = await this.ctx.service.waitTimes.list.getByDestDaterange(params);
      }
    }

    async id() {
      const { date, startDate, endDate, type, granularity = 'hour' } = this.ctx.query;
      const { id } = this.ctx.params;
      this.ctx.validate(this.paramsBase, this.ctx.query);
      this.ctx.validate(this.paramsRule[type], this.ctx.query);

      const params = {
        id,
        type,
      };

      if (type === 'date') {
        params.date = date;
        params.granularity = granularity;
        this.ctx.body = await this.ctx.service.waitTimes.list.getByIdDate(params);
      } else if (type === 'daterange') {
        params.startDate = startDate;
        params.endDate = endDate;
        this.ctx.body = await this.ctx.service.waitTimes.list.getByIdDaterange(params);
      }
    }
  }
  return Controller;
};
