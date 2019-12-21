module.exports = app => {
  class Controller extends app.Controller {
    async sync() {
      const data = await this.ctx.service.destinations.list.sync();
      this.ctx.body = data;
    }
  }
  return Controller;
};
