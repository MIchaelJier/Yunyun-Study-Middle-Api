const request = require('./index')
const querystring = require('querystring')

const noHandle = (router,method,hereUrl,toUrl) => {
  if(method === 'GET'){
    router.get(hereUrl, (req, res, next) => {
      requestThen(
        request.get(reqData(req, `${toUrl}?${querystring.stringify(req.query)}`,method)),
        res
      )
    })
  }else if(method === 'POST'){
    router.post(hereUrl, (req, res, next) => {
      requestThen(
        request.post(reqData(req,toUrl,method)),
        res,
      )
    })
  }
},
  reqData = (req, url, method) => {
    const auth = req.get("Authorization"),
      con = req.get("Content-Type")
    let requestData = {
      url
    }
    if(method === 'POST'){
      requestData.data = con === "application/x-www-form-urlencoded" ? querystring.stringify(req.body) : req.body
    }
    if(auth || con){
      requestData.headers = {}
      auth ? requestData.headers['Authorization'] = auth : ''
      con  ? requestData.headers['Content-Type']  = con  : ''
    }
    return requestData
  },
  requestThen = (promise, res) => {
    promise.then(({ data }) => {
      res.json(data)
    }).catch(({ errmsg, name }) => {
      res.json({
        errmsg,
        name,
        code: 1,
      })
    })
  }
module.exports = noHandle
