module.exports = app => {
  const mongoose = app.mongoose
  const DsOperateSchema = new mongoose.Schema({
    local: { type: String },
    flowMaxAvg: { type: Number },
    markMaxAvg: { type: Number }
  })

  DsOperateSchema.index({ date: -1, local: 1 })
  return mongoose.model('DsOperate', DsOperateSchema, 'ds_operate')
}
