module.exports = app => {
  const mongoose = app.mongoose
  const DsExplorer = new mongoose.Schema({
    local: { type: String },
    id: { type: String },
    name: { type: String },
    ancestors: { type: Array },
    relatedLocations: { type: Array },
    medias: { type: Array },
    descriptions: { type: Array },
    facets: { type: Array },
    fastPass: { type: String },
    webLink: { type: String },
    status: { type: Number },
    utime: { type: Number }
  })
  DsExplorer.index({ id: 1, local: 1, status: 1 })

  return mongoose.model('DsAttraction', DsExplorer, 'ds_attractions')
}
