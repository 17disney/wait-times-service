const fs = require('fs');

function exportMedia(item) {
  let list = [];
  const medias = item.medias;
  if (medias && medias.length) {
    list = medias.map(_ => _.url);
  }
  return list;
}

function arrayDiff(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const diff = [];
  for (const item of set1) {
    if (!set2.has(item)) diff.push(item);
  }

  return diff;
}

module.exports = app => {
  class Service extends app.Service {
    async getScan() {
      const res = await this.ctx.service.api.disneyScan({
        url: 'api/disneyEtl/destinations/lasted',
      });

      const { data, date } = res;
      const { added: list, facetGroups } = data;
      return { list, facetGroups };
    }

    formatMedia(mediaList = []) {
      mediaList.forEach(item => {
        const { path } = this.ctx.helper.parseUrl(item.url);
        item.url = path.split('/').join('__');
      });
      return mediaList;
    }
    // 根据 url 生成附件列表
    generAttachmentList(medias) {
      const list = [];
      medias.forEach(url => {
        const { path } = this.ctx.helper.parseUrl(url);
        const item = {
          file: path.split('/').join('__'),
          type: 'disneyScan',
          sourceUrl: url,
        };
        list.push(item);
      });
      return list;
    }

    async saveList(list, { local }) {
      for (const item of list) {
        item.local = local;
        item.medias = this.formatMedia(item.medias);

        const { id } = item;
        await this.ctx.model.Destinations.update(
          { id },
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

    async sync() {
      const { list, facetGroups } = await this.getScan();
      const local = 'shanghai';
      // 保存媒体列表
      const medias = [];
      list.forEach(item => {
        medias.push(...exportMedia(item));
      });
      const failList = await this.saveMediaList(medias);

      if (failList.length === 0) {
        await this.saveList(list, { local });
        await this.saveGroups(facetGroups, { local });
      }
    }

    async saveMediaList(medias) {
      const list = this.generAttachmentList(medias);

      const sourceUrlList = list.map(_ => _.sourceUrl);
      const oldMediaList = await this.ctx.model.Attachments.find({
        sourceUrl: { $in: sourceUrlList },
      });

      const downedList = oldMediaList.map(_ => _.sourceUrl);
      const downloadList = arrayDiff(sourceUrlList, downedList);

      return await this.downloadByMedias(downloadList);
    }

    async saveGroups(data, { local }) {
      await this.ctx.model.DestinationsGroups.update(
        { local },
        {
          $set: {
            local,
            data,
          },
        },
        {
          upsert: true,
        }
      );
    }

    async downloadByMedias(medias) {
      const list = this.generAttachmentList(medias);

      const failList = [];
      for (const item of list) {
        const { sourceUrl, file } = item;
        const filepath = `app/public/${file}`;

        let isDownload = false;
        if (fs.existsSync(filepath)) {
          const states = fs.statSync(filepath);
          const { size } = states;
          if (size > 0) {
            await this.ctx.model.Attachments.create(item);
            isDownload = true;
          } else {
            fs.unlinkSync(filepath);
          }
        }

        if (!isDownload) {
          try {
            await this.ctx.service.download.save(sourceUrl, filepath);
          } catch (e) {
            failList.push(item);
            return;
          }
          await this.ctx.model.Attachments.create(item);
        }
      }
      return failList;
    }

    async findByLocal(local) {
      const data = await this.ctx.model.Destinations.findOne({ local });
      return data;
    }
  }
  return Service;
};
