'use strict';

// 天气服务
const config = require('config-lite')(__dirname);
const superAgent = require('superagent');
const moment = require('moment');

const ApiUrl = config.weatherService.url;

module.exports = {
  day: async (city, date) => {
    const query = {
      city,
      date,
    };
    const url = `${ApiUrl}/weather/day`;
    const data = await superAgent.get(url).query(query);
    return data.body;
  },
  search: async (city, st, et) => {
    const query = {
      city,
      st,
      et,
    };
    const url = `${ApiUrl}/weather/search`;
    const data = await superAgent.get(url).query(query);
    return data.body;
  },
};
