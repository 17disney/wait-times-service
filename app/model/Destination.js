'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Destination = new mongoose.Schema({
    title: { type: String },
    medias: { type: Array },
    updataAt: { type: Date },
    createAt: { type: Date },
  });

  return mongoose.model('Destination', Destination, 'Destination');
};
