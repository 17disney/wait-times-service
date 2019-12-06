module.exports = app => {
  class Controller extends app.Controller {
    async today() {
      const data = await this.ctx.service.waitTimes.sync.today();
      this.ctx.body = data;
    }

    async date() {
      const { date } = this.ctx.params;
      const data = await this.ctx.service.waitTimes.sync.syncByDate(date);
      this.ctx.body = data;
    }
  }
  return Controller;
};
