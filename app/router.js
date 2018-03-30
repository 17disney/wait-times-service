/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.get('/explorer-service/schedules/:local/:date', controller.explorer.schedules)
  router.get('/explorer-service/destinations/:local', controller.explorer.destinations)

  router.get('/explorer/schedules/:local/:date', controller.explorer.schedules)
  router.get('/explorer/schedules-pre/:local', controller.explorer.schedulesPre)
  router.get('/explorer/destinations-raw/:local', controller.explorer.destinationsRaw)

  router.get('/explorer/destinations/:local', controller.explorer.destinations)
  router.put('/explorer/destinations/:id', controller.explorer.updateDestinationsId)
  // router.post('/explorer/destinations/:local/:id', controller.explorer.destinationList)

  // router.post('/explorer-admin/destinations/:local', controller.explorer.addDestinations)


  // router.get('/explorer-service/facet-groups/:local', controller.explorer.facetGroups)

  router.get('/wait-times/park/:local/:date', controller.waitTimes.park)
  router.get('/wait-times/attractions/:local/:date', controller.waitTimes.attractions)
  router.get('/wait-times/attractions/:local/:date/:id', controller.waitTimes.attractionsId)

  router.get('/wait-count/park/:local', controller.waitCount.park)
  router.get('/wait-count/attractions/:local/:id', controller.waitCount.attractionsId)

  router.get('/ticket/available/:local', controller.ticket.available)
  router.get('/ticket/available/:local/:date', controller.ticket.availableDate)

  // router.put('/wait-forecast/park/:local/:date', controller.waitForecast.park)

  // router.get('/wait-forecast/attractions/:local/:id', controller.forecast.attractionsId)
  // router.put('/wait-forecast/attractions/:local/:id', controller.waitForecast.attractionsId)
  // router.get('/wait-forecast/attractions/:local/:id', controller.waitCount.attractionsId)

}
