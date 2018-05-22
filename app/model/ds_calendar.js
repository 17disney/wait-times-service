module.exports = app => {
  const mongoose = app.mongoose
  const DsCalendarSchema = new mongoose.Schema({
    date: { type: String },
    local: { type: String },
    data: { type: Array },
  })

  DsCalendarSchema.index({ date: -1, local: 1 })
  return mongoose.model('DsCalendar', DsCalendarSchema, 'ds_calendars')
}
