'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const WaitTimes = new mongoose.Schema({
    id: { type: String },
    baseId: { type: String },
    type: { type: String },
    dest: { type: String },
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    status: { type: String },
    waitList: { type: Array },
    waitListHour: { type: Array },
    waitList10M: { type: Array },
    waitTotal: { type: Number },
    waitAvg: { type: Number },
    waitMax: { type: Number },
    utime: { type: Number },
  });

  WaitTimes.index({ id: 1, date: 1 });

  return mongoose.model('WaitTimes', WaitTimes, 'WaitTimes');
};
