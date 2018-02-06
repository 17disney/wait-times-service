module.exports = app => {
  const mongoose = app.mongoose
  const DsAttractionSchema = new mongoose.Schema({
    date: { type: String },
    local: { type: String },
    id: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    status: { type: String },

    waitMax: { type: Number },
    waitAvg: { type: Number },
    waitList: { type: Array },
    waitHour: { type: Array },
    waitMaxList: { type: Array },

    fpList: { type: Array },
    utime: { type: Number }
  })
  DsAttractionSchema.index({ waitAvg: -1, id: 1, local: 1 })

  return mongoose.model('DsAttraction', DsAttractionSchema, 'ds_attractions')
}
