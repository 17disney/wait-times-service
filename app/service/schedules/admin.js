function formatItem(item) {
  const { schedule, id } = item;

  let schedules;
  if (schedule) {
    schedules = schedule.schedules.map(_ => {
      return {
        date: _.date,
        status: _.type,
        startTime: _.startTime,
        endTime: _.endTime,
      };
    });
  }
  return {
    id,
    schedules,
  };
}

module.exports = app => {
  class Service extends app.Service {
    async fetchScan(date) {
      let url;
      if (date) {
        url = `api/disneyEtl/schedules/history/${date}`;
      } else {
        url = 'api/disneyEtl/schedules/lasted';
      }

      const data = await this.ctx.service.api.disneyScan({
        url,
      });
      return data;
    }

    async filterByDate(data, date) {
      const list = data.map(formatItem).filter(_ => _.schedules);
      return list;
    }

    // TODO
    async getOneDay(date) {
      let data = await this.getDate(date);
      data = this.filterByDate(data.data, date);

      const list = data.map(item => {
        const { schedules = [] } = item;
        return {
          id: item.id,
          ...schedules.find(_ => _.date === date),
        };
      });

      for (const item of list) {
        await this.ctx.model.WaitTimes.update(
          {
            id: item.id,
            date,
          },
          {
            $set: item,
          },
          {
            upsert: true,
          }
        );
      }

      return list;
    }
  }
  return Service;
};
