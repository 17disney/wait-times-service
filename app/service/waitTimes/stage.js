const moment = require('moment');

module.exports = app => {
  class Service extends app.Service {
    async getByDestDate(dest, date) {
      const data = await this.ctx.model.WaitTimesStage.find(
        {
          date,
          local: 'shanghai',
        },
        {
          _id: 0,
          id: 1,
          startTime: 1,
          endTime: 1,
        }
      );

      for (const item of data) {
        const { startTime, endTime } = item;
        const { id, waitList: list } = await this.getByIdDate(item.id, date);
        if (list.length) {
          await this.ctx.service.waitTimes.admin.saveWaitItem({ id, date, startTime, endTime, list });
        }
      }
      return data;
    }

    async getByIdDate(id, date) {
      const data = await this.ctx.model.WaitTimesStage.findOne({
        id,
        date,
      });

      return {
        id: `${data.id};entityType=Attraction;destination=shdr`,
        waitList: data.waitList.map(item => {
          const [ utime, minius, status ] = item;
          return {
            date: moment(utime, 'x').format('YYYY-MM-DD HH:mm:ss'),
            minius,
            status,
          };
        }),
      };
    }
  }
  return Service;
};
