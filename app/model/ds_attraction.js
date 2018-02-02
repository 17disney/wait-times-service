module.exports = app => {
  const mongoose = app.mongoose
  const DsAttractionSchema = new mongoose.Schema({
    date: { type: String },
    local: { type: String },
    schedule: { type: Object },
    startTime: { type: Date },
    endTime: { type: Date },
    status: { type: String },
    waitList: { type: Array },
    fpList: { type: Array },
    waitMax: { type: Number },
    waitAvg: { type: Number },
    waitMaxList: { type: Array },
    waitHour: { type: Array },
    utime: { type: Number }
  })

  return mongoose.model('DsAttraction', DsAttractionSchema, 'ds_attractions')
}
