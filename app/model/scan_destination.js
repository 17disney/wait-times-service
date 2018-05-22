module.exports = app => {
  const mongoose = app.mongoose
  const ScanDestinationSchema = new mongoose.Schema(
    {
      date: { type: String },
      local: { type: String },
      added: { type: Array },
      updated: { type: Array },
      removed: { type: Array },
      facetGroups: { type: Object },
      utime: { type: Number }
    },
    { versionKey: false }
  )

  return mongoose.model(
    'ScanDestination',
    ScanDestinationSchema,
    'scan_destinations'
  )
}
