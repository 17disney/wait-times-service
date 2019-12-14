const { difference } = require('lodash/array');

function filterGranularity(type) {
  const COLUMNS_MAP = {
    '1m': 'waitList',
    hour: 'waitListHour',
    '10m': 'waitList10M',
  };
  return {
    [COLUMNS_MAP[type]]: 1,
  };
}

module.exports = app => {
  class Service extends app.Service {
    async getByDestDate({ dest, date, granularity }) {
      const data = await this.ctx.model.WaitTimes.find({
        date,
      }, {
        _id: 0,
        id: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        ...filterGranularity(granularity),
      });
      return data;
    }

    async getByIdDate(id, { date, granularity }) {
      const data = await this.ctx.model.WaitTimes.find({
        date,
        id,
      }, {
        _id: 0,
        startTime: 1,
        endTime: 1,
        status: 1,
        ...filterGranularity(granularity),
      });
      return data;
    }

    async getByIdDaterange(id, { startDate, endDate }) {
      console.log(111, id);
      const data = await this.ctx.model.WaitTimes.find({
        id,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }, {
        _id: 0,
        id: 1,
        date: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        waitTotal: 1,
        waitAvg: 1,
        waitMax: 1,
      });
      return data;
    }
  }
  return Service;
};
