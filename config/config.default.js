module.exports = appInfo => {
  const config = (exports = {});
  config.keys = appInfo.name + '_1517557438743_8898';
  config.middleware = [ 'notfoundHandler', 'errorHandler' ];

  config.mongoose = {
    url: 'mongodb://localhost:27017/disney_park',
  };

  return config;
};
