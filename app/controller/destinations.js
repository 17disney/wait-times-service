module.exports = app => {
  class Controller extends app.Controller {
    async sync() {
      const data = await this.ctx.service.destinations.list.sync();
      this.ctx.body = data;
    }

    async dest() {
      const { dest } = this.ctx.params;
      const list = await this.ctx.service.destinations.list.findByDest(dest);
      const groups = await this.ctx.service.destinations.groups.findByDest(dest);
      this.ctx.body = {
        list,
        groups,
      };
    }


  }
  return Controller;
};
