const fs = require('fs');

function exportMedia(item) {
  let list = [];
  const medias = item.medias;
  if (medias && medias.length) {
    list = medias.map(_ => _.url);
  }
  return list;
}

module.exports = app => {
  class Controller extends app.Controller {
    async getScan() {
      const res = await this.ctx.service.api.disneyScan({
        url: 'api/disneyEtl/destinations/lasted',
      });

      const { data, date } = res;
      const { added: list } = data;
      return list;
    }

    async sync() {
      const list = await this.getScan();

      // 图片是否已缓存
      // 未缓存触发缓存，缓存失败，标记状态0
      // 替换图片路径
      // 是否需要更新
      // 是否需要更新缓存
      //
      for (const item of list) {

        await this.ctx.model.Destination.update({

        });
      }
      // const nList = []

      // list.forEach(item => {
      //   nList.push({
      //     id: item.id,
      //     type: item.type
      //     cacheId: item.cacheId
      //     title: item.name
      //     cacheId: item.cacheId
      //   })
      // })

      return list;
    }

    async download() {
      const list = await this.getScan();
      const medias = [];

      list.forEach(item => {
        medias.push(...exportMedia(item));
      });


      await this.saveList(medias);
      const downloadList = await this.getDownloadList();
      await this.saveFile(downloadList);

      return medias;
    }

    async saveList(medias) {
      const list = [];

      medias.forEach(url => {
        const { path } = this.ctx.helper.parseUrl(url);
        const file = path.split('/').join('__');

        const item = {
          file,
          type: 'disneyScan',
          sourceUrl: url,
          isDownload: false,
        };
        list.push(item);
      });

      for (const item of list) {
        const { file } = item;
        await this.ctx.model.Attachments.update(
          { file, isDownload: false },
          {
            $set: item,
          },
          {
            upsert: true,
          }
        );
      }
    }

    async getDownloadList() {
      const list = await this.ctx.model.Attachments.find({
        isDownload: false,
      });

      return list;
    }

    async saveFile(list) {
      for (const item of list) {
        const { sourceUrl, file } = item;
        const filepath = `app/public/${file}`;

        let isDownload = false;
        if (fs.existsSync(filepath)) {
          const states = fs.statSync(filepath);
          const { size } = states;

          if (size > 0) {
            await this.ctx.model.Attachments.update({
              file,
            }, {
              isDownload: true,
            });
            isDownload = true;
          } else {
            fs.unlinkSync(filepath);
          }
        }

        if (!isDownload) {
          try {
            console.log('download', isDownload);
            await this.ctx.service.download.save(sourceUrl, filepath);
          } catch (e) {
            return;
          }

          await this.ctx.model.Attachments.update({
            file,
          }, {
            isDownload: true,
          });
        }
      }
    }
  }
  return Controller;
};
