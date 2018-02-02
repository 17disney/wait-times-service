/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/park', controller.park.index)
  router.get('/explorer-service/:id', controller.explorer.index)
}
