module.exports = app => {
  class Controller extends app.Controller {
    async readyData() {
      const { date } = this.ctx.query;
      const waitData = await this.ctx.service.plans.virtuals.getWaitTimesByDate(date);
      const playsData = await this.ctx.service.plans.virtuals.getPlaysData();

      this.ctx.body = {
        waitData,
        playsData,
      };
    }

    async plays() {
      const { list, date, startTime } = this.ctx.request.body;
      this.ctx.body = await this.ctx.service.plans.virtuals.plays({ list, date, startTime });
    }
  }
  return Controller;
};
