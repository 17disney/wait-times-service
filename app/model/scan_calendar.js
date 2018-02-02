module.exports = app => {
  const mongoose = app.mongoose
  const ScanCalendarSchema = new mongoose.Schema({
    date: { type: String },
    local: { type: String },
    locations: { type: Array },
    filters: { type: Object },
    utime: { type: Number }
  })

  return mongoose.model('ScanCalendar', ScanCalendarSchema, 'scan_calendars')
}
