module.exports = app => {
  class Controller extends app.Controller {
    async sync() {
      const data = await this.ctx.service.destinations.list.sync();
      this.ctx.body = data;
    }

    async update() {
      const { info, id } = this.ctx.request.body;
      const saveDATA = {
        info,
      };
      await this.ctx.service.destinations.admin.updateById(id, saveDATA);
      this.ctx.body = saveDATA;
    }
  }
  return Controller;
};
