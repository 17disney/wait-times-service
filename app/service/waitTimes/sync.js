const moment = require('moment');
const { arrayAvg } = require('../../utils/array');

function formatGranularity({ date, startTime, endTime, list, granularity }) {
  const startX = Number(moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm:ss').format('X'));
  const endX = Number(moment(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm:ss').format('X'));
  const timeGroupList = [];

  for (let i = startX; i < endX; i += granularity) {
    timeGroupList.push({
      start: i,
      end: i + granularity,
      items: [],
    });
  }

  list.forEach(item => {
    const num = moment(item.date).format('X');
    timeGroupList.forEach(_ => {
      const { start, end } = _;
      if (num >= start && num < end) {
        _.items.push(item);
      }
    });
  });

  const waitList = [];
  timeGroupList.forEach(item => {
    waitList.push({
      date: moment(item.start, 'X').format('YYYY-MM-DD HH:mm:ss'),
      minutes: Math.round(arrayAvg(item.items.map(_ => _.minutes))),
    });
  });

  return waitList;
}

function formatMinutes(val) {
  val = Number(val);
  return isNaN(val) || val === 0 ? 0 : val;
}

function formatScanWaitList({ date, startTime, endTime, list }) {
  const startX = moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm:ss').format('X');
  const endX = moment(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm:ss').format('X');

  const waitList = list.filter(_ => {
    const time = moment(_.date).format('X');
    return time > startX && time < endX;
  }).map(_ => {
    return {
      ..._,
      minutes: formatMinutes(_.minutes),
    };
  });

  return waitList;

  // return {
  //   date: waitList.map(_ => _.date),
  //   minutes: waitList.map(_ => formatMinutes(_.minutes)),
  // };
}

module.exports = app => {
  class Service extends app.Service {
    async getByDate(date) {
      const data = await this.ctx.model.WaitTimes.find({ date });
      return data;
    }

    async getScan(date) {
      let url;
      if (date) {
        url = `api/disneyEtl/waitTimes/history/${date}`;
      } else {
        url = 'api/disneyEtl/waitTimes/today';
      }
      const data = await this.ctx.service.api.disneyScan({
        url,
      });
      return data;
    }

    async today() {
      const data = await this.getScan();
      const item = data['hotelSHDLH;entityType=resort;destination=shdr'];
      return item;
    }

    async syncByDate(date) {
      const list = await this.getByDate(date);
      const allWaitList = await this.getScan(date);

      for (const item of list) {
        const { id, startTime, endTime, status } = item;

        if (status === 'Operating') {
          if (allWaitList[id] && allWaitList[id].length) {
            const waitList = formatScanWaitList({ date, startTime, endTime, list: allWaitList[id] });
            item.waitList = waitList;
            item.waitListHour = formatGranularity({ date, startTime, endTime, list: waitList, granularity: 3600 });
            item.waitList10M = formatGranularity({ date, startTime, endTime, list: waitList, granularity: 600 });

            await this.ctx.model.WaitTimes.update({ id, date }, {
              $set: {
                waitList,
                waitListHour: item.waitListHour,
                waitList10M: item.waitList10M,
              },
            });
          }
        }
      }

      return list[0];
    }
  }
  return Service;
};
