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
  }
  return Controller;
};
