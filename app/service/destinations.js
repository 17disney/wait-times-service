const fs = require('fs');

function exportMedia(item) {
  let list = [];
  const medias = item.medias;
  if (medias && medias.length) {
    list = medias.map(_ => _.url);
  }
  return list;
}

function formatMedia(mediaList = []) {
  mediaList.forEach(item => {
    const { path } = this.ctx.helper.parseUrl(item.url);
    item.url = path.split('/').join('__');
  });
  return mediaList;
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
// 根据 url 生成附件列表
function generAttachmentList(medias) {
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
        item.medias = formatMedia(item.medias);
      }

      await this.ctx.model.Destination.create(list);
      return list;
    }

    async download() {
      const list = await this.getScan();

      // 读取媒体列表
      const medias = [];
      list.forEach(item => {
        medias.push(...exportMedia(item));
      });
      const failList = await this.saveMediaList(medias);

      if (failList.length === 0) {
        //
        await this.sync(list);
      }
      // const downloadList = await this.getDownloadList();
      // await this.saveFile(downloadList);

    }

    async saveMediaList(medias) {
      const list = generAttachmentList(medias);

      const sourceUrlList = list.map(_ => _.sourceUrl);
      const oldMediaList = await this.ctx.model.Attachments.find({
        sourceUrl: { $in: sourceUrlList },
      });

      const downedList = oldMediaList.map(_ => _.sourceUrl);
      const downloadList = arrayDiff(sourceUrlList, downedList);

      await this.downloadByMedias(downloadList);
    }

    async downloadByMedias(medias) {
      const list = generAttachmentList(medias);

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
            console.log('download', sourceUrl);
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
  }
  return Controller;
};
