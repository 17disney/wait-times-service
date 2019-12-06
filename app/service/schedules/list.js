module.exports = app => {
  class Service extends app.Service {
    async getByDate(date) {
      const data = await this.ctx.model.WaitTimes.find({ date });
      return data;
    }
  }
  return Service;
};
