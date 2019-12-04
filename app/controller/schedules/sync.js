module.exports = app => {
  class Controller extends app.Controller {
    async today() {
      const data = await this.ctx.service.schedules.sync.getDate();
      this.ctx.body = data;
    }

    async date() {
      const { date } = this.ctx.params;
      const data = await this.ctx.service.schedules.sync.getOneDay(date);
      this.ctx.body = data;
    }
  }
  return Controller;
};
