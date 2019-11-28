'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Attachments = new mongoose.Schema({
    file: { type: String },
    hash: { type: String },
    url: { type: String },
    sourceUrl: { type: String },
    type: { type: String },
    cdnUrl: { type: String },
    size: { type: Number },
    isDownload: {
      type: Boolean,
      default: false,
    },
  });

  return mongoose.model('Attachments', Attachments, 'Attachments');
};
