'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const DsSchedulesSchema = new mongoose.Schema(
    {
      date: { type: String },
      local: { type: String },
      id: { type: String },
      schedules: { type: Array },
      utime: { type: Number },
    },
    { versionKey: false }
  );
  DsSchedulesSchema.index({ id: 1 });
  DsSchedulesSchema.index({ local: 1, date: 1 });
  return mongoose.model('DsSchedules', DsSchedulesSchema, 'ds_schedules');

  // return mongoose.model('DsSchedules')
};
