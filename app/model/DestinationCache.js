'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const DestinationCache = new mongoose.Schema({
    title: { type: String },
    medias: { type: Array },
    updataAt: { type: Date },
    createAt: { type: Date },
  });

  return mongoose.model('DestinationCache', DestinationCache, 'DestinationCache');
};
