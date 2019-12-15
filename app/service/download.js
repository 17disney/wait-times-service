const fs = require('fs');
const request = require('request');

function download(uri, filename, callback) {
  const stream = fs.createWriteStream(filename);
  request(uri)
    .pipe(stream)
    .on('close', callback);
}

module.exports = app => {
  class Controller extends app.Controller {
    save(url, filepath) {
      return new Promise((resolve, reject) => {
        download(url, filepath, () => {
          resolve();
        });
      });
    }
  }
  return Controller;
};
