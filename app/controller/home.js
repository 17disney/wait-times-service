'use strict';

const Controller = require('egg').Controller;
const pkg = require('../../package.json');

class HomeController extends Controller {
  async index() {
    const { name, version } = pkg;
    this.ctx.body = { name, version };
  }
}

module.exports = HomeController;
