module.exports = app => {
  class Controller extends app.Controller {
    async park() {
      const { dest = 'shdr', date, startDate, endDate, type, granularity = 'hour' } = this.ctx.query;

      let data;
      const params = {
        dest,
      };

      if (type === 'date') {
        params.date = date;
        params.granularity = granularity;
        data = await this.ctx.service.waitTimes.list.getByDestDate(params);
      } else if (type === 'daterange') {
        params.startDate = startDate;
        params.endDate = endDate;
        data = await this.ctx.service.waitTimes.list.getByDestDaterange(params);
      }

      this.ctx.body = data;
    }

    async id() {
      const { id, date, startDate, endDate, type, granularity = 'hour' } = this.ctx.query;

      let data;
      const params = {
        id,
      };

      if (type === 'date') {
        params.date = date;
        params.granularity = granularity;
        data = await this.ctx.service.waitTimes.list.getByIdDate(params);
      } else if (type === 'daterange') {
        params.startDate = startDate;
        params.endDate = endDate;
        data = await this.ctx.service.waitTimes.list.getByIdDaterange(params);
      }

      this.ctx.body = data;
    }
  }
  return Controller;
};
