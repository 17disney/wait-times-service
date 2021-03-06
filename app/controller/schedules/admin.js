const { exportDaterangeList } = require('../../utils/date');

module.exports = app => {
  class Controller extends app.Controller {
    async sync() {
      const { type, date, startDate, endDate } = this.ctx.query;
      const result = [];
      if (type === 'date') {
        result.push(await this.ctx.service.schedules.admin.syncByDate(date));
      } else if (type === 'daterange') {
        for (const date of exportDaterangeList(startDate, endDate)) {
          result.push(await this.ctx.service.schedules.admin.syncByDate(date));
        }
      }
      this.ctx.body = result;
    }
  }
  return Controller;
};
