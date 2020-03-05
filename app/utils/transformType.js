


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

exports.timestampToTime = timestamp =>{
  let date = new Date(timestamp);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
  let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
  let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
  return Y+M+D+h+m+s;
}

