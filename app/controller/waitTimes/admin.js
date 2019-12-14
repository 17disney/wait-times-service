const { exportDaterangeList } = require('../../utils/date');

module.exports = app => {
  class Controller extends app.Controller {
    async sync() {
      const { date, startDate, endDate, type, dest, alter } = this.ctx.query;

      const result = [];
      if (type === 'date') {
        result.push(await this.ctx.service.waitTimes.admin.syncByDate(date, { dest, alter }));
      } else if (type === 'daterange') {
        for (const date of exportDaterangeList(startDate, endDate)) {
          result.push(await this.ctx.service.waitTimes.admin.syncByDate(date, { dest, alter }));
        }
      }
      this.ctx.body = result;
    }

    async count() {
      const { type } = this.ctx.query;

      if (type === 'all') {
        //
      } else if (type === 'day') {
        //
      } else if (type === 'week') {
        //
      } else if (type === 'month') {
        //
      }
    }
  }
  return Controller;
};
