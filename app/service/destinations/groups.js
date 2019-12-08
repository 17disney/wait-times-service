module.exports = app => {
  class Service extends app.Service {
    async findByDest(dest) {
      const data = await this.ctx.model.DestinationsGroups.find();
      return data;
    }
  }
  return Service;
};
