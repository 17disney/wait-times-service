module.exports = appInfo => {
  const config = (exports = {})
  config.keys = appInfo.name + '_1517557438743_8898'
  config.middleware = ['notfoundHandler', 'errorHandler']

  config.mongoose = {
    url: ''
  }

  return config
}
