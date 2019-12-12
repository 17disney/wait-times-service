module.exports = app => {
  class Controller extends app.Controller {
    async sync() {
      const { type, date } = this.ctx.query;

      const result = [];
      if (type === 'date') {

        const data = await this.ctx.service.schedules.admin.getOneDay(date);
        result.push(data);
      }
      this.ctx.body = result;
    }
  }
  return Controller;
};
