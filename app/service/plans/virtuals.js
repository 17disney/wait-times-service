const moment = require('moment');

function getDistance(lat1, lng1, lat2, lng2) {
  const radLat1 = lat1 * Math.PI / 180.0;
  const radLat2 = lat2 * Math.PI / 180.0;
  const a = radLat1 - radLat2;
  const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
  Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  return s;
}

function mathWalkTime(id1, id2, playsData) {
  const { latitude: lat1, longitude: lng1 } = playsData[id1].coordinates;
  const { latitude: lat2, longitude: lng2 } = playsData[id2].coordinates;
  const distanceKM = getDistance(lat1, lng1, lat2, lng2);
  return parseInt(3600 / 3 * distanceKM);
}

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
          coordinates: item.relatedLocations[0].coordinates[0],
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
      let walkTimeTotal = 0;
      const plans = [];
      startTime = Number(moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm:ss').format('X'));
      list.forEach((item, index) => {
        const { id } = item;
        const waitTime = findIdWaitTime(startTime, waitData[id]);
        const playTime = 300;
        const endTime = startTime + waitTime + playTime;
        waitTimeTotal += waitTime;

        let walkTime;
        if (index > 0) {
          const beforeId = list[index - 1].id;
          walkTime = mathWalkTime(id, beforeId, playsData);
          startTime += walkTime;
          walkTimeTotal += walkTime;
        }

        plans.push({
          id,
          startTime,
          endTime,
          waitTime,
          walkTime,
        });

        startTime = endTime;
      });

      console.timeEnd('wait');
      return {
        list: formatPlansView(plans),
        waitTimeTotal,
        walkTimeTotal,
      };
    }
  }
  return Controller;
};
