const moment = require('moment');
const { difference } = require('lodash/array');

const GRANULARITY_LIST = [
  {
    columns: 'waitList',
    type: '1m',
  },
  {
    columns: 'waitList10M',
    type: '10m',
  },
  {
    columns: 'waitListHour',
    type: 'hour',
  },
];

function filterGranularity(type) {
  const item = GRANULARITY_LIST.find(_ => _.type === type);
  return {
    [item.columns]: 1,
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

    async getByDestLatest(dest) {
      const date = moment().format('YYYY-MM-DD');
      const data = await this.ctx.model.WaitTimes.findOne(
        {
          dest,
          date,
        },
        {
          _id: 0,
          waitList: { $slice: -1 },
        }
      );
      return data;
    }

    async getByIdDate(id, { date, granularity }) {
      const gItem = GRANULARITY_LIST.find(_ => _.type === granularity);
      const data = await this.ctx.model.WaitTimes.findOne({
        date,
        id,
      }, {
        _id: 0,
        startTime: 1,
        endTime: 1,
        status: 1,
        ...filterGranularity(granularity),
      });
      return data[gItem.columns];
    }

    async getByIdDaterange(id, { startDate, endDate }) {
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
