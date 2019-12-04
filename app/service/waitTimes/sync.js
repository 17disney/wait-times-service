module.exports = app => {
  class Service extends app.Service {
    async getScan() {
      const data = await this.ctx.service.api.disneyScan({
        url: 'api/disneyEtl/waitTimes/today',
      });
      return data;
    }

    async today() {
      const data = await this.getScan();
      const item = data['hotelSHDLH;entityType=resort;destination=shdr'];

      return item;
    }
  }
  return Service;
};
