'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const DestinationsGroups = new mongoose.Schema({
    dest: { type: String },
    data: { type: Object },
    updataAt: { type: Date },
    createAt: { type: Date },
  });

  return mongoose.model('DestinationsGroups', DestinationsGroups, 'DestinationsGroups');
};
