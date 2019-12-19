module.exports = app => {
  class Controller extends app.Controller {
    async plays() {
      const { list, date, startTime } = this.ctx.request.body;
      this.ctx.body = await this.ctx.service.plans.virtuals.plays({ list, date, startTime });
    }
  }
  return Controller;
};
