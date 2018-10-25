'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const DsDestinationSchema = new mongoose.Schema(
    {
      name: { type: String },
      date: { type: String },
      local: { type: String },
      type: { type: String },
      id: { type: String },
      ancestors: { type: Array },
      descriptions: { type: Array },
      facets: { type: Array },
      medias: { type: Array },
      relatedLocations: { type: Array },
      webLink: { type: String },
      cacheId: { type: String },
      hotLevel: { type: Number }, // 项目等级
      playType: { type: Number }, // 项目类型
      runMax: { type: Number }, // 最大承载量 x/分钟
      runDefault: { type: Number }, // 运行承载 x/分钟
      runInterval: { type: Number }, // 运行间隔 x/分钟
      runTimer: { type: Number }, // 运行时长
      groupNum: { type: Number }, // 每组人数 x/分钟
      visible: { type: Boolean },
      updataAt: { type: Date },
      createAt: { type: Date },
    },
    { versionKey: false }
  );

  DsDestinationSchema.index({ id: 1 });
  DsDestinationSchema.index({ local: 1 });

  return mongoose.model('DsDestination', DsDestinationSchema, 'ds_destinations');
};
