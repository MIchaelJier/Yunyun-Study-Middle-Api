


// 图片地址
const baseUrl = '//fuss10.elemecdn.com'

exports.queryString = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc.push(`${key}=${obj[key]}`)
    return acc
  }, []).join('&')
}

exports.formatImageUrl = (hash) => {
  if (!hash) {
    return null
  }
  const suffixArray = ['png', 'bmp', 'jpg', 'gif', 'jpeg', 'svg']
  const suffix = suffixArray.find(v =>  hash.indexOf(v) !== -1)
  if (!suffix) {
    return null
  } else {
    return `${baseUrl}/${hash.substring(0,1)}/${hash.substring(1,3)}/${hash.substring(3)}.${suffix}`
  }
}

exports.formatArrayQuery = (arr, key) => {
  if (!Array.isArray(arr)) return ''
  return arr.reduce((acc, val) => {
    acc.push(`${key}[]=${val}`)
    return acc
  }, []).join('&')
}

exports.TimeDiff = time => {
  let otime=new Date(Date.parse(time.replace(/-|\./g,"/"))),
    curtime = new Date();
  if(otime > curtime) return true
  else return false
}
