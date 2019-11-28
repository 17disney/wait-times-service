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
    async download() {
      const res = await this.ctx.service.api.disneyScan({
        url: 'api/disneyEtl/destinations/lasted',
      });

      const { data, date } = res;
      const { added: list } = data;
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
