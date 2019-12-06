const moment = require('moment');

function formatGranularity({ startX, endX, list, granularity }) {
  const timeList = [];
  startX = Number(startX);
  endX = Number(endX);
  for (let i = startX; i < endX; i += granularity) {
    timeList.push({
      start: i,
      end: i + granularity,
      item: [],
    });
  }

  list.forEach(item => {
    const num = moment(item.date).format('X');
    timeList.forEach(_ => {
      const { start, end } = _;
      if (num >= start && num < end) {
        _.item.push(item);
      }
    });
  });

  return timeList;
}

function formatDate({ date, startTime, endTime, list, granularity = 3600 }) {
  const startX = moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm:ss').format('X');
  const endX = moment(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm:ss').format('X');

  const data = list.filter(_ => {
    const time = moment(_.date).format('X');
    return time > startX && time < endX;
  });

  return formatGranularity({ startX, endX, list: data, granularity });
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
      const waitList = await this.getScan(date);

      list.forEach(item => {
        const { id, startTime, endTime, status } = item;

        if (status === 'Operating') {
          if (waitList[id] && waitList[id].length) {
            item.waitList = formatDate({ date, startTime, endTime, list: waitList[id] });
          }
        }
      });

      return list;
    }
  }
  return Service;
};
