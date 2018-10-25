'use strict';

// 天气服务
const config = require('config-lite')(__dirname);
const superAgent = require('superagent');
const moment = require('moment');

const ApiUrl = config.travelService.url;

module.exports = {
  flowDay: async (cid, date) => {
    const query = {
      cid,
      date,
    };
    const url = `${ApiUrl}/flow/day`;
    const data = await superAgent.get(url).query(query);
    return data.body;
  },
};
