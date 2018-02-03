module.exports = app => {
  const mongoose = app.mongoose
  const ScanTicketSchema = new mongoose.Schema({
    date: { type: String },
    local: { type: String },

    standardPrice: { type: Number },
    oldPrice: { type: Number },
    childPrice: { type: Number },
    availableCount: { type: Number },
    availableList: { type: Array },

    utime: { type: Number }
  })

  return mongoose.model('ScanTicket', ScanTicketSchema, 'scan_tickets')
}
