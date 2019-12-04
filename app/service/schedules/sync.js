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
    async getScan(date) {
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

    async getDate(date) {
      const res = await this.getScan(date);

      const { data } = res;
      const list = data.map(formatItem).filter(_ => _.schedules);
      console.log(list);

      return list;
    }

    async getOneDay(date) {
      const data = await this.getDate(date);

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
