'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const WaitTimes = new mongoose.Schema({
    id: { type: String },
    date: { type: String },
    dest: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    status: { type: String },
    waitList: { type: Array },
    waitListHour: { type: Array },
    waitList10M: { type: Array },
    waitCount: { type: Number },
    utime: { type: Number },
  });

  return mongoose.model('WaitTimes', WaitTimes, 'WaitTimes');
};
