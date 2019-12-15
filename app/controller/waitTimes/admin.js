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
      const { type, startDate } = this.ctx.query;
      const result = [];

      const countList = await this.ctx.service.destinations.list.findByCountList('shdr');
      if (type === 'all') {
        result.push(await this.ctx.service.waitTimes.admin.countByAll(countList));
      } else if (type === 'week') {
        result.push(await this.ctx.service.waitTimes.admin.countByWeek(countList, { startDate }));
      } else if (type === 'month') {
        result.push(await this.ctx.service.waitTimes.admin.countByMonth(countList, { startDate }));
      }

      this.ctx.body = result;
    }
  }
  return Controller;
};
