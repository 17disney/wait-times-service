'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Destinations = new mongoose.Schema({
    id: { type: String },
    type: { type: String },
    title: { type: String },
    ancestors: { type: Array },
    local: { type: String },
    descriptions: { type: Array },
    relatedLocations: { type: Array },
    webLink: { type: String },
    facets: { type: Array },
    medias: { type: Array },
    cacheId: { type: String },
    updataAt: { type: Date },
    createAt: { type: Date },
  });

  return mongoose.model('Destinations', Destinations, 'Destinations');
};
