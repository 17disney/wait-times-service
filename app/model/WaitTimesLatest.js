'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const WaitTimesLatest = new mongoose.Schema({
    id: { type: String },
    data: { type: Object },
    utime: { type: Number },
  });

  WaitTimesLatest.index({ id: 1 });

  return mongoose.model('WaitTimesLatest', WaitTimesLatest, 'WaitTimesLatest');
};
