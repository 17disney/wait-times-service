const Service = require('egg').Service
const moment = require('moment')
const {dateRangeList, sortByDate} = require('../utils')

class DataService extends Service {
  fillDate(st, et, data) {
    const dateSet = new Set(dateRangeList(st, et))
    data.forEach(item => {
      dateSet.delete(item.date)
    })

    const nullLength = [...dateSet].length

    if (nullLength > 0) {
      for (let date of dateSet) {
        data.push({
          date
        })
      }
      data = sortByDate(data)
    }
    return data
  }
}

module.exports = DataService
