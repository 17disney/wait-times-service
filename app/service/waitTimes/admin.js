const moment = require('moment');
const { arrayAvg, arraySum } = require('../../utils/array');
// 获取星期最后一天
function getWeekEndDate(date) {
  let d = Number(moment(date).format('d'));
  d = d === 0 ? 6 : d - 1; // 周一为 0
  return moment(date).add(d === 6 ? 0 : 6 - d, 'days').format('YYYY-MM-DD');
}

function countWaitData(data) {
  const waitAvgList = data.map(_ => _.waitAvg);
  const waitMaxList = data.map(_ => _.waitMax);
  const waitTotalList = data.map(_ => _.waitTotal);

  return {
    waitTotal: arraySum(waitTotalList),
    waitMax: Math.max(...waitMaxList),
    waitMin: Math.min(...waitAvgList),
    waitAvg: parseInt(arrayAvg(waitAvgList)),
  };
}
// 时间粒度计算
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
    const itemMinutelist = item.items.map(_ => _.minutes);
    if (itemMinutelist.length) {
      waitList.push({
        date: moment(item.start, 'X').format('YYYY-MM-DD HH:mm:ss'),
        minutes: Math.round(arrayAvg(itemMinutelist)),
      });
    }
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

  const waitList = [];
  let waitTotal = 0;
  let total = 0;
  let waitMax = 0;

  list.forEach(item => {
    const minutes = formatMinutes(item.minutes);
    const time = moment(item.date).format('X');

    if (time > startX && time < endX) {
      waitTotal += minutes;
      total++;
    }
    if (minutes > waitMax) waitMax = minutes;
    waitList.push({
      ...item,
      minutes,
    });
  });

  return {
    waitTotal: parseInt(waitTotal / total * ((endX - startX) / 60)) || 0,
    waitAvg: parseInt(waitTotal / total) || 0,
    waitMax,
    waitList,
  };
}

module.exports = app => {
  class Service extends app.Service {
    async findByDate(date) {
      const data = await this.ctx.model.WaitTimes.find({ date });
      return data;
    }

    async today() {
      const data = await this.fetchScanByDate();
      const item = data['hotelSHDLH;entityType=resort;destination=shdr'];
      return item;
    }

    async syncByLatest() {
      const date = moment().format('YYYY-MM-DD');
      let attList = await this.findByDate(date);
      if (!attList.length) {
        // 同步时间表
        attList = await this.ctx.service.schedules.admin.syncByDate(date);
        if (!attList.length) return { error: '无法读取时间表' };
      }

      const params = {
        utime: attList[0].utime,
      };
      console.log(`${date}: fetchWait...`);
      const scanData = await this.ctx.service.api.disneyScan('waitTimes/today', params);
      console.log(scanData);
      return await this.saveWaitList(date, { scanData, attList, append: true });
    }

    async syncByDate(date) {
      let attList = await this.findByDate(date);
      if (!attList.length) {
        // 同步时间表
        attList = await this.ctx.service.schedules.admin.syncByDate(date);
        if (!attList.length) return { error: '无法读取时间表' };
      }

      console.log(`${date}: fetchWait...`);
      const scanData = await this.ctx.service.api.disneyScan(`waitTimes/history/${date}`);
      return await this.saveWaitList(date, { scanData, attList });
    }

    async countByWaitItem(data) {
      const { id, date, startTime, endTime, waitList } = data;
      const waitListHour = formatGranularity({ date, startTime, endTime, list: waitList, granularity: 3600 });
      const waitList10M = formatGranularity({ date, startTime, endTime, list: waitList, granularity: 600 });

      await this.updateByIdDate(id, date, {
        waitListHour,
        waitList10M,
      });
    }

    async updateByDate(date) {
      const list = await this.findByDate(date);
      for (const item of list) {
        await this.countByWaitItem(item);
      }
    }

    async updateByIdDate(id, date, saveData) {
      await this.ctx.model.WaitTimes.update(
        { id, date },
        {
          $set: saveData,
        },
        {
          upsert: true,
        }
      );

    }

    async saveWaitItem({ id, date, startTime, endTime, list }) {
      const { waitList, waitTotal, waitAvg, waitMax } = formatScanWaitList({ date, startTime, endTime, list });
      const lastDate = waitList[waitList.length - 1].date;
      const utime = moment(lastDate, 'YYYY-MM-DD HH:mm:ss').format('X');
      await this.ctx.model.WaitTimes.update(
        { id, date },
        {
          $set: {
            waitList,
            // waitListHour,
            // waitList10M,
            utime,
          },
        },
        {
          upsert: true,
        }
      );
      // 按天统计
      await this.ctx.model.WaitTimesCounts.update(
        { id, date, type: 'day' },
        {
          $set: {
            waitTotal,
            waitAvg,
            waitMax,
          },
        },
        {
          upsert: true,
        }
      );
      return { waitList, waitAvg, waitMax, waitTotal };
    }

    async saveWaitList(date, { scanData, attList, append = false }) {
      let operatingTotal = 0;
      const destItem = attList.find(_ => _.type === 'theme-park');
      let destWaitList = [];
      let destWaitAvg = 0;

      for (const item of attList) {
        const { id, startTime, endTime, status } = item;
        if (status === 'Operating' && scanData[id] && scanData[id].length) {
          let list = scanData[id];
          if (append) list = item.waitList.concat(list);
          const { waitList, waitAvg } = await this.saveWaitItem({ id, date, startTime, endTime, list });
          // 乐园统计
          if (!destWaitList.length) {
            destWaitList = waitList;
          } else {
            destWaitList.forEach((item, index) => {
              item.minutes += waitList[index].minutes;
            });
          }
          operatingTotal++;
          destWaitAvg += waitAvg;

          await this.countByAll(id);
          console.log(`${id}: ok`);
        }
      }
      // 乐园综合统计
      await this.countDest(destItem, { waitList: destWaitList, waitAvg: destWaitAvg });
      console.log(`${date}: ok`);
      return { operatingTotal };
    }

    // 乐园统计
    async countDest(item, { waitList, waitAvg }) {
      const { startTime, endTime } = item;
      const { id, date } = item;

      let waitTotal = 0;
      let waitMax = 0;
      waitList.forEach(item => {
        waitTotal += item.minutes;
        if (item.minutes > waitMax) waitMax = item.minutes;
      });

      const waitListHour = formatGranularity({ date, startTime, endTime, list: waitList, granularity: 3600 });
      const waitList10M = formatGranularity({ date, startTime, endTime, list: waitList, granularity: 600 });
      const lastDate = waitList[waitList.length - 1].date;
      const utime = moment(lastDate, 'YYYY-MM-DD HH:mm:ss').format('X');

      await this.ctx.model.WaitTimes.update({ id, date }, {
        $set: {
          waitList: waitList.map(_ => {
            return {
              minutes: _.minutes,
              date: _.date,
            };
          }),
          waitListHour,
          waitList10M,
          waitTotal,
          waitAvg,
          waitMax,
          utime,
        },
      });
    }

    async countByAll(list) {
      let countTotal = 0;
      for (const item of list) {
        const { id } = item;
        const data = await this.ctx.model.WaitTimesCounts.find({ id, type: 'day' });
        if (data && data.length) {
          await this.ctx.model.WaitTimesCounts.update(
            { id, type: 'all' },
            {
              $set: countWaitData(data),
            },
            {
              upsert: true,
            }
          );
          countTotal++;
        }
      }
      return {
        countTotal,
      };
    }

    async countByWeek(atts, { startDate } = {}) {
      for (const att of atts) {
        const { id } = att;
        const list = await this.ctx.model.WaitTimesCounts.find({ id, type: 'day' });
        if (list && list.length) {
          let itemData = [];
          for (const item of list) {
            const date = moment(item.date).format('YYYY-MM-DD');
            itemData.push(item);
            if (date === getWeekEndDate(date)) {
              await this.ctx.model.WaitTimesCounts.update(
                { id, date, type: 'week' },
                {
                  $set: countWaitData(itemData),
                },
                {
                  upsert: true,
                }
              );
              itemData = [];
            }
          }
        }
      }
    }

    countByMonth(list, { startDate } = {}) {
      // let countTotal = 0;
      for (const item of list) {
        const { id } = item;
        //
      }
    }
  }
  return Service;
};
