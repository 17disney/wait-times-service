'use strict';

/**
 * @param {Egg.Application} app - egg application
*/

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 时间表
  router.get('/admin/schedules/sync', controller.schedules.admin.sync);
  router.get('/schedules/date/:date', controller.schedules.list.date);
  // 资料
  router.get('/admin/destinations/sync', controller.destinations.sync);
  router.get('/destinations/dest/:dest', controller.destinations.dest);
  // 等候时间
  router.get('/admin/waitTimes/sync', controller.waitTimes.admin.sync);
  router.get('/admin/waitTimes/count', controller.waitTimes.admin.count);
  router.get('/admin/waitTimes/stage', controller.waitTimes.admin.stage);
  router.get('/waitTimes/dest/:dest', controller.waitTimes.list.dest);
  router.get('/waitTimes/id/:id', controller.waitTimes.list.id);
  // 游玩规划
  router.post('/plans/virtuals/plays', controller.plans.virtuals.plays);
};
