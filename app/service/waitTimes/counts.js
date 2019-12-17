module.exports = app => {
  class Service extends app.Service {
    async getById(id, { type, startDate, endDate } = {}) {
      console.log(id, startDate);
      const data = await this.ctx.model.WaitTimesCounts.find({
        id,
        type,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }, {
        _id: 0,
        id: 1,
        date: 1,
        waitTotal: 1,
        waitAvg: 1,
        waitMax: 1,
      });
      return data;
    }
  }
  return Service;
};
