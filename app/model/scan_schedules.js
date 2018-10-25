'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const ScanSchedulesSchema = new mongoose.Schema({
    date: { type: String },
    local: { type: String },
    filters: { type: Array },
    body: { type: Array },
    utime: { type: Number },
  });

  return mongoose.model('ScanSchedules', ScanSchedulesSchema, 'scan_schedules');
};
