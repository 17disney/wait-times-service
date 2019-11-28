function parseUrl(url) {
  const urlObj = {
    protocol: /^(.+)\:\/\//,
    host: /\:\/\/(.+?)[\?\#\s\/]/,
    path: /\w(\/.*?)[\?\#\s]/,
    query: /\?(.+?)[\#\/\s]/,
    hash: /\#(\w+)\s$/,
  };
  url += ' ';
  function formatQuery(str) {
    return str.split('&').reduce((a, b) => {
      const arr = b.split('=');
      a[arr[0]] = arr[1];
      return a;
    }, {});
  }
  for (const key in urlObj) {
    const pattern = urlObj[key];
    urlObj[key] = key === 'query' ? (pattern.exec(url) && formatQuery(pattern.exec(url)[1])) : (pattern.exec(url) && pattern.exec(url)[1]);
  }
  return urlObj;
}

module.exports = parseUrl;
