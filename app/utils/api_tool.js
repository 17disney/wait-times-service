'use strict';

const moment = require('moment');

function getAncestorsName(item, type, data) {
  const descId = item.find(_ => _.type === type).id;
  const itemData = data.find(_ => _.id === descId);
  return itemData;
}

const objectToLine = arg => {
  let line = [];

  for (const k in arg) {
    const item = arg[k];
    if (k === '__id__') {
      line.push(item);
    } else {
      line.push(`${k}=${item}`);
    }
  }

  line = line.join(';');
  return line;
};

const lineToObject = arg => {
  const obj = {};
  const arr = arg.split(';');

  for (let item of arr) {
    item = item.split('=');
    if (item.length == 1) {
      obj.__id__ = item[0];
    } else {
      obj[item[0]] = item[1];
    }
  }
  return obj;
};

const createUrl = data => {
  let url = data.host + data.path + '/';
  if (data.arg) {
    url += objectToLine(data.arg);
  }
  return url;
};

const utcDate = utc => {
  const date = moment()
    .utcOffset(utc)
    .format('YYYY-MM-DD');
  return date;
};

exports.createUrl = createUrl;
exports.objectToLine = objectToLine;
exports.lineToObject = lineToObject;
exports.utcDate = utcDate;
exports.getAncestorsName = getAncestorsName;
