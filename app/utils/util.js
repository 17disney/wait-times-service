const crypto = require('crypto')
const md5 = crypto.createHash('md5')

var createSession = () => {
  return (
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2)
  )
}

exports.createSession = createSession

exports.to = promise => {
  return promise
    .then(data => {
      return [null, data]
    })
    .catch(err => [err])
}

const removeProperty = object => {
  for (let key in object) {
    let value = object[key]
    if (value === '' || value === undefined) {
      delete object[key]
    }
  }
}

exports.removeProperty = removeProperty

exports.md5 = str => {
  var ret = crypto
    .createHash('md5')
    .update(str.toString())
    .digest('hex')
  return ret
}

exports.arrayAvg = arr => {
  let avg = 0
  if (arr.length > 0) {
    avg = arr.reduce((a, b) => a + b, 0) / arr.length
  }
  return avg
}

exports.compare = (property) => {
  return function(a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value1 - value2
  }
}

function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

exports.deepClone = deepClone
