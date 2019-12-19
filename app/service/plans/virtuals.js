const moment = require('moment');

function findIdWaitTime(time, list) {
  for (let i = 0; i < list.length; i++) {
    if (i === 0) continue;
    const item = list[i];
    const { time: nowTime, minutes } = item;
    const beforeTime = list[i - 1].time;
    if (time >= beforeTime && time < nowTime) {
      return minutes * 60;
    }
  }
}

function formatWaitList(list) {
  list.forEach(item => {
    item.time = Number(moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('X'));
  });
  return list;
}

function formatPlansView(list) {
  return list.map(item => {
    return {
      ...item,
      startTime: moment(item.startTime, 'X').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(item.endTime, 'X').format('YYYY-MM-DD HH:mm:ss'),
    };
  });
}

module.exports = app => {
  class Controller extends app.Controller {
    async getPlaysData() {
      const data = await this.ctx.service.destinations.list.findByDest('shdr', { type: 'Attraction' });
      const dataMap = {};
      data.forEach(item => {
        dataMap[item.id] = {
          name: item.name,
          coordinates: item.relatedLocations[0].coordinates,
        };
      });

      return dataMap;
    }

    async getWaitTimesByDate(date) {
      const data = await this.ctx.model.WaitTimes.find({
        date,
      });

      const dataMap = {};
      for (const item of data) {
        dataMap[item.id] = formatWaitList(item.waitList);
      }
      return dataMap;
    }

    async plays({ list, date, startTime }) {
      const waitData = await this.getWaitTimesByDate(date);
      const playsData = await this.getPlaysData();

      let waitTimeTotal = 0;
      const plans = [];
      startTime = Number(moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm:ss').format('X'));
      list.forEach(item => {
        const { id } = item;
        const waitTime = findIdWaitTime(startTime, waitData[id]);
        const endTime = startTime + waitTime;
        waitTimeTotal += waitTime;
        plans.push({
          id,
          startTime,
          endTime,
          waitTime,
        });

        startTime = endTime;
      });

      return {
        playsData,
        list: formatPlansView(plans),
        waitTimeTotal,
      };
    }
  }
  return Controller;
};
