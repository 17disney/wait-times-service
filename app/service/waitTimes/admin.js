const moment = require('moment');
const { arrayAvg, arraySum } = require('../../utils/array');

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
    waitTotal: parseInt(waitTotal / total * ((endX - startX) / 60)),
    waitAvg: parseInt(waitTotal / total),
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

    async syncByDate(date, { alter = false } = {}) {
      let attList = await this.findByDate(date);
      if (!attList.length) {
        // 同步时间表
        attList = await this.ctx.service.schedules.admin.syncByDate(date);
        if (!attList.length) return { error: '无法读取时间表' };
      }

      console.log(`${date}: fetchWait...`);
      const scanData = await this.ctx.service.api.disneyScan(`waitTimes/history/${date}`);
      console.log(`${date}: fetchWait ok`);
      let operatingTotal = 0;
      const destItem = attList.find(_ => _.type === 'theme-park');
      let destWaitList = [];
      let destWaitAvg = 0;

      for (const item of attList) {
        const { id, startTime, endTime, status } = item;
        if (status === 'Operating' && scanData[id] && scanData[id].length) {
          const { waitList, waitTotal, waitAvg, waitMax } = formatScanWaitList({ date, startTime, endTime, list: scanData[id] });
          const waitListHour = formatGranularity({ date, startTime, endTime, list: waitList, granularity: 3600 });
          const waitList10M = formatGranularity({ date, startTime, endTime, list: waitList, granularity: 600 });
          const lastDate = waitList[waitList.length - 1].date;
          const utime = moment(lastDate, 'YYYY-MM-DD HH:mm:ss').format('X');

          if (!destWaitList.length) {
            destWaitList = waitList;
          } else {
            destWaitList.forEach((item, index) => {
              item.minutes += waitList[index].minutes;
            });
          }
          operatingTotal++;
          destWaitAvg += waitAvg;

          await this.ctx.model.WaitTimes.update({ id, date }, {
            $set: {
              waitList,
              waitListHour,
              waitList10M,
              // waitTotal,
              // waitAvg,
              // waitMax,
              utime,
            },
          });

          await this.ctx.model.WaitTimesCounts.update(
            { id, date, countType: 'day' },
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

          await this.countByAll(id);
          console.log(`${id}: ok`);
        }
      }
      // 乐园综合统计
      await this.countDest(destItem, { waitList: destWaitList, waitAvg: destWaitAvg });
      console.log(`${date}: ok`);

      return { operatingTotal };
    }

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
        const data = await this.ctx.model.WaitTimesCounts.find({ id, countType: 'day' });
        if (data && data.length) {
          const waitAvgList = data.map(_ => _.waitAvg);
          const waitMaxList = data.map(_ => _.waitMax);
          const waitTotalList = data.map(_ => _.waitTotal);

          await this.ctx.model.WaitTimesCounts.update(
            { id, countType: 'all' },
            {
              $set: {
                waitTotal: arraySum(waitTotalList),
                waitMax: Math.max(...waitMaxList),
                waitMin: Math.min(...waitAvgList),
                waitAvg: parseInt(arrayAvg(waitAvgList)),
              },
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
    // TODO
    async countByWeek(list, { startDate } = {}) {
      // let countTotal = 0;
      // 实际开始

      let endDate;

      for (const item of list) {
        const { id } = item;
        const list = await this.ctx.model.WaitTimesCounts.find({ id, countType: 'day' });
        if (list && list.length) {
          startDate = list[0].date;


          list.forEach(item => {
            const { date } = item;

          });

          const d = moment(startDate, 'YYYY-MM-DD').format('d');
          if (d === 1) {
            //
            itemEnd = moment(startDate, 'YYYY-MM-DD').add(7).format('YYYY-MM-DD');
          } else {
            itemEnd = moment(startDate, 'YYYY-MM-DD').add(7 - d).format('YYYY-MM-DD');

          }

          endDate = list[list.length - 1].date;
        }
      }

      console.log(endDate);
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
