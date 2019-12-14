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
  router.get('/destinations/dest/:dest', controller.destinations.dest);
  router.get('/admin/destinations/sync', controller.destinations.sync);
  // 等候时间
  router.get('/admin/waitTimes/sync', controller.waitTimes.admin.sync);
  router.get('/waitTimes/dest/:dest', controller.waitTimes.list.dest);
  router.get('/waitTimes/id/:id', controller.waitTimes.list.id);

  // router.get('/operate/park/:local', controller.operate.park);
  // router.get('/operate/park/:local/day', controller.operate.day)
  // router.get('/ticket/available/:local', controller.ticket.available);
  // router.get('/ticket/available/:local/:date', controller.ticket.availableDate);
};
