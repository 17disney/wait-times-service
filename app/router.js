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

  router.get('/destinations/park/:local', controller.destinations.park);
  router.get('/destinations/sync', controller.destinations.sync);
  router.get('/schedules/sync/date/:date', controller.schedules.sync.date);
  router.get('/schedules/date/:date', controller.schedules.list.date);
  router.get('/waitTimes/sync/today', controller.waitTimes.sync.today);
  router.get('/waitTimes/sync/date/:date', controller.waitTimes.sync.date);

  router.get('/wait-times/home/:local/:date', controller.waitTimes.attractions);
  // router.get('/wait-times/home/:local', controller.waitCount.home)

  router.get('/wait-times/park/:local', controller.waitCount.park);
  router.get('/wait-times/park/:local/:date', controller.waitTimes.home);

  router.get('/wait-times/attractions/:local/:id/:date', controller.waitTimes.attractionsId);
  router.get('/wait-times/attractions/:local/:id', controller.waitCount.attractionsId);

  router.get('/operate/park/:local', controller.operate.park);
  // router.get('/operate/park/:local/day', controller.operate.day)

  router.get('/datav/park/:local/shows', controller.datav.show.parkShows);
  router.get('/datav/park/:local/waits/live', controller.datav.wait.live);
  router.get('/datav/park/:local/parks/live', controller.datav.park.live);
  router.get('/datav/park/:local/parks/live/:id', controller.datav.park.liveId);

  router.get('/ticket/available/:local', controller.ticket.available);
  router.get('/ticket/available/:local/:date', controller.ticket.availableDate);
};
