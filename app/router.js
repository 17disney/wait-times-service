/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.get('/schedules/park/:local/:date', controller.explorer.schedules)
  router.get('/schedules/pre/:local', controller.explorer.schedulesPre)
  router.get('/schedules/attractions/:id', controller.explorer.schedulesList)

  router.get('/destinations/park/:local', controller.explorer.destinations)
  // router.put('/destinations/park/:local/:id', controller.explorer.updateDestinationsId)
  router.get('/destinations/raw/:local', controller.explorer.destinationsRaw)

  router.get('/calendars/:local', controller.calendar.list)

  router.get('/wait-times/home/:local/:date', controller.waitTimes.attractions)
  // router.get('/wait-times/home/:local', controller.waitCount.home)

  router.get('/wait-times/park/:local', controller.waitCount.park)
  router.get('/wait-times/park/:local/:date', controller.waitTimes.home)

  router.get('/wait-times/attractions/:local/:id/:date', controller.waitTimes.attractionsId)
  router.get('/wait-times/attractions/:local/:id', controller.waitCount.attractionsId)

  router.get('/operate/park/:local', controller.operate.park)
  // router.get('/operate/park/:local/day', controller.operate.day)

  router.get('/datav/park/:local/shows', controller.datav.parkShows)

  router.get('/ticket/available/:local', controller.ticket.available)
  router.get('/ticket/available/:local/:date', controller.ticket.availableDate)
}
