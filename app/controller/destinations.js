module.exports = app => {
  class Controller extends app.Controller {
    async download() {
      const data = await this.ctx.service.destinations.download();
      this.ctx.body = data;
    }

    async sync() {
      const data = await this.ctx.service.destinations.sync();
      this.ctx.body = data;
    }
  }
  return Controller;
};
