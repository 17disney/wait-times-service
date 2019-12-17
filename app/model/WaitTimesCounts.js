'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const WaitTimesCounts = new mongoose.Schema({
    id: { type: String },
    type: { type: String },
    date: { type: String },
    waitList: { type: Array },
    waitTotal: { type: Number },
    waitAvg: { type: Number },
    waitMin: { type: Number },
    waitMax: { type: Number },
    utime: { type: Number },
  });

  WaitTimesCounts.index({ id: 1, type: 1, date: 1 });

  return mongoose.model('WaitTimesCounts', WaitTimesCounts, 'WaitTimesCounts');
};
