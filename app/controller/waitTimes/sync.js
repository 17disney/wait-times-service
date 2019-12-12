module.exports = app => {
  class Controller extends app.Controller {
    async today() {
      const data = await this.ctx.service.waitTimes.sync.today();
      this.ctx.body = data;
    }

    async dest() {
      const { date, startDate, endDate, type } = this.ctx.query;

      let result = [];
      if (type === 'date') {
        result = await this.ctx.service.waitTimes.sync.syncByDate(date);
      } else if (type === 'dagerange') {
        //
      }
      this.ctx.body = result;
    }
  }
  return Controller;
};
