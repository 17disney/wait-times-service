/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.get('/explorer-service/schedules/:local/:date', controller.explorer.schedules)
  router.get('/explorer-service/destinations/:local', controller.explorer.destinations)
  router.get('/explorer-service/facet-groups/:local', controller.explorer.facetGroups)

  router.get('/wait-times/park/:local', controller.waitTimes.parkToday)
  router.get('/wait-times/park/:local/:date', controller.waitTimes.park)
  router.get('/wait-times/attractions/:local/:date', controller.waitTimes.attractions)
  router.get('/wait-times/attractions/:local/:date/:id', controller.waitTimes.attractionsId)

  router.get('/wait-count/park/:local', controller.waitCount.park)
  router.get('/wait-count/attractions/:local/:id', controller.waitCount.attractionsId)

  router.get('/ticket/available/:local', controller.ticket.available)
  router.get('/ticket/available/:local/:date', controller.ticket.availableDate)
}
