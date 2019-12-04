module.exports = app => {
  class Controller extends app.Controller {
    async sync() {
      const data = await this.ctx.service.destinations.list.sync();
      this.ctx.body = data;
    }

    async park() {
      const { local } = this.ctx.params;
      const list = await this.ctx.service.destinations.list.findByLocal(local);
      const groups = await this.ctx.service.destinations.groups.findByLocal(local);
      this.ctx.body = {
        list,
        groups,
      };
    }
  }
  return Controller;
};
