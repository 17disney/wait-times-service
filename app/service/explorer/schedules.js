'use strict';

const moment = require('moment');
const Service = require('egg').Service;
const { lineToObject, objectToLine } = require('../../utils/api_tool');
const superAgent = require('superagent');

class SchedulesService extends Service {
  async getSchedules(local, date) {
    const { ctx } = this;
    let data = await ctx.service.explorer.schedules.getByLocalDate(local, date);
    // 从原始时间表查找并更新至新表
    if (data.length === 0) {
      data = await ctx.service.explorer.schedules.getPreByLocalDate(local, date);

      let activities = [];
      for (const item of data) {
        activities = activities.concat(item.body[0].activities);
      }

      data = [];

      for (const item of activities) {
        const { id, schedule } = item;
        const type = lineToObject(id).entityType;
        if (type === 'Entertainment') {
          if (schedule && schedule.schedules) {
            let schedules = schedule.schedules;
            if (schedules) {
              // 取当天
              schedules = schedules.filter(_ => _.date === date);
              schedules = schedules.map(_ => _.startTime);
              if (schedules.length > 0) {
                const _data = {
                  id,
                  schedules,
                };
                data.push(_data);
                await ctx.service.explorer.schedules.updateByLocalDateId(
                  local,
                  date,
                  id,
                  _data
                );
              }
            }
          }
        }
      }
    }
    // 从旧数据库查找并更新至新表
    if (data.length === 0) {
      const _date = moment(date, 'YYYY-MM-DD')
        .subtract(1, 'days')
        .format('YYYY-MM-DD');
      data = await superAgent.get(
        `http://weather.17disney.com/tp/api/schedules/${_date}`
      );
      let schedules = data.body.data;
      data = [];

      for (const item of schedules) {
        const { name, type, time_list } = item;
        if (type === 4) {
          const ids = {
            __id__: name,
            entityType: 'Entertainment',
            destination: 'shdr',
          };
          const id = objectToLine(ids);
          const timeList = time_list.filter(_ => _.date === date);
          schedules = timeList.map(_ => _.start_time);

          if (schedules.length > 0) {
            const _data = {
              id,
              schedules,
            };
            data.push(_data);

            await ctx.service.explorer.schedules.updateByLocalDateId(
              local,
              date,
              id,
              _data
            );
          }
        }
      }
    }
    return data;
  }

  async getPreByLocalDate(local, date) {
    const find = {
      local,
      date,
    };
    const data = await this.ctx.model.ScanSchedules.find(find, {
      _id: 0,
    });

    return data;
  }

  async getByLocalDate(local, date) {
    const find = {
      local,
      date,
    };
    const data = await this.ctx.model.DsSchedules.find(find, {
      _id: 0,
      date: 0,
      local: 0,
    });
    return data;
  }

  async getByRangId(id, st, et) {
    const find = {
      id,
      date: {
        $gte: st,
        $lte: et,
      },
    };

    const data = await this.ctx.model.DsSchedules.find(find, {
      _id: 0,
      id: 0,
      local: 0,
    }).sort({ date: 1 });
    return data;
  }

  async updateByLocalDateId(local, date, id, data) {
    const find = {
      local,
      date,
      id,
    };
    const ret = await this.ctx.model.DsSchedules.update(
      find,
      {
        $set: data,
      },
      {
        upsert: true,
      }
    );

    return ret;
  }
}

module.exports = SchedulesService;
