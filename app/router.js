/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/explorer-service/calendar/:local/:date', controller.explorer.calendars)
  router.get('/explorer-service/destinations/:local', controller.explorer.destinations)
  router.get('/explorer-service/facet-groups/:local', controller.explorer.facetGroups)

  router.get('/attractions/all/:local/:date', controller.attraction.index)
  router.get('/attractions/search/:id', controller.attraction.index)

}
