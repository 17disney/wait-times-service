module.exports = app => {
  class Service extends app.Service {
    async findByDest(dest) {
      const data = await this.ctx.model.DestinationsGroups.findOne();
      return data.data;
    }
  }
  return Service;
};
