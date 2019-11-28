const axios = require('axios');

module.exports = app => {
  class Service extends app.Service {
    disneyScan(request) {
      const { method = 'get', url, params } = request;
      return new Promise((resolve, reject) => {
        axios({
          method,
          url: `http://localhost:8001/${url}`,
          params,
        }).then(response => {
          resolve(response.data);
        });
      });
    }
  }
  return Service;
};
