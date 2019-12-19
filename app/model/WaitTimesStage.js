'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const WaitTimesStage = new mongoose.Schema({
    date: { type: String },
    local: { type: String },
    id: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    status: { type: String },

    waitMax: { type: Number },
    waitAvg: { type: Number },
    waitList: { type: Array },
    waitHour: { type: Array },
    waitMaxList: { type: Array },

    waitFt: { type: Number },
    waitMath: { type: Array },
    waitFtList: { type: Array },

    fpList: { type: Array },

    rankWait: { type: Number },
    fpFinish: { type: Number },
  });

  return mongoose.model('WaitTimesStage', WaitTimesStage, 'WaitTimesStage');
};
