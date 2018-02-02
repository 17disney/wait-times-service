module.exports = app => {
  class ScanCalendarService extends app.Service {
    //  * show: (params) {
    //   let find = {
    //     date:'2018-02-02',
    //     local:'shanghai'
    //   }
    //   // let data = awiat this.ctx.model.ScanCalendar.find(find)
    //   return data
    // }

    async show(params) {
      let find = {
        date: '2018-02-02',
        local: 'shanghai'
      }
      // let data = awiat this.ctx.model.ScanCalendar.find(find)
      return data
    }
  }
}
