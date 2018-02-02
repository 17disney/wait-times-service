// const Controller = require('egg').Controller

// class ExplorerController extends Controller {
//   async index(params) {
//     // console.log(this.service.scan_calendar)
//     let data = await this.service.scan_calendar.show()
//     ctx.body = data
//   }
// }

// module.exports = ExplorerController

exports.index = async ctx => {
  let find = {
    date: '2018-02-02',
    local: 'shanghai'
  }
  ctx.body = await ctx.model.ScanCalendar.find(find)
}
