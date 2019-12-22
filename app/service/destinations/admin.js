module.exports = app => {
  class Service extends app.Service {
    async updateById(id, update) {
      return await this.ctx.model.Destinations.update(
        { id },
        {
          $set: update,
        },
        {
          upsert: true,
        }
      );
    }
  }
  return Service;
};
