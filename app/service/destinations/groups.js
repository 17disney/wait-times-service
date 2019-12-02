module.exports = app => {
  class Service extends app.Service {
    async findByLocal(local) {
      const data = await this.ctx.model.DestinationsGroups.find({ local });
      return data;
    }
  }
  return Service;
};
