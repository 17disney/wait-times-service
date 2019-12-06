module.exports = app => {
  class Controller extends app.Controller {
    async date() {
      const { date } = this.ctx.params;
      const data = await this.ctx.service.schedules.list.getByDate(date);
      this.ctx.body = data;
    }
  }
  return Controller;
};
