const moment = require('moment');

exports.exportDaterangeList = function(startDate, endDate) {
  const FORMAT = 'YYYY-MM-DD';
  const length = moment(endDate, FORMAT).diff(moment(startDate, FORMAT), 'days');

  const list = [];
  for (let i = 0; i <= length; i++) {
    const date = moment(startDate, FORMAT).add(i, 'days').format(FORMAT);
    list.push(date);
  }
  return list;
};
