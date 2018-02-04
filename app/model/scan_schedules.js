module.exports = app => {
  const mongoose = app.mongoose
  const ScanSchedulesSchema = new mongoose.Schema()

  return mongoose.model('ScanSchedules', ScanSchedulesSchema, 'scan_schedules')
}
