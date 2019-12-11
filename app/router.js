'use strict';

/**
 * @param {Egg.Application} app - egg application
*/

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/schedules/park/:local/:date', controller.explorer.schedules);
  router.get('/schedules/pre/:local', controller.explorer.schedulesPre);
  router.get('/schedules/attractions/:id', controller.explorer.schedulesList);
  router.get('/schedules/admin/sync', controller.schedules.admin.sync);
  router.get('/schedules/date/:date', controller.schedules.list.date);

  router.get('/destinations/dest/:dest', controller.destinations.dest);
  router.get('/destinations/tasks/sync', controller.destinations.sync);

  router.get('/waitTimes/sync/today', controller.waitTimes.sync.today);
  router.get('/waitTimes/sync/dest', controller.waitTimes.sync.dest);
  router.get('/waitTimes/list/park', controller.waitTimes.list.park);
  router.get('/waitTimes/list/id', controller.waitTimes.list.id);

  // router.get('/operate/park/:local', controller.operate.park);
  // router.get('/operate/park/:local/day', controller.operate.day)
  // router.get('/ticket/available/:local', controller.ticket.available);
  // router.get('/ticket/available/:local/:date', controller.ticket.availableDate);
};
