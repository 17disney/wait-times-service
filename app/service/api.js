const axios = require('axios');

module.exports = app => {
  class Service extends app.Service {
    disneyScan(url, params) {
      // const { method = 'get', url, params } = request;
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `http://home-u1.xanke.net:8001/api/etl/${url}`,
          params,
        }).then(response => {
          resolve(response.data);
        });
      });
    }
  }
  return Service;
};
