/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/explorer-service/calendar/:local/:date', controller.explorer.calendars)
  router.get('/explorer-service/destinations/:local', controller.explorer.destinations)
}
