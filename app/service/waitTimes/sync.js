module.exports = app => {
  class Service extends app.Service {
    async getScan() {
      const res = await this.ctx.service.api.disneyScan({
        url: 'api/disneyEtl/waitTimes/today',
      });

      return res;
    }

    async today() {
      const res = await this.getScan();
      const data = res.data;

      return data;
    }
  }
  return Service;
};
