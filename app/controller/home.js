const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'Disney-api'
  }
}

module.exports = HomeController
