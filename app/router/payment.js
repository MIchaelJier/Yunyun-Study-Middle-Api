const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')
const querystring = require('querystring')

noHandle(router,'POST','/createOrder','/api/order/createOrder')

// Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1
// noHandle(router,'GET','/unifiedPay','/api/pay/public/unifiedPay')

router.get('/unifiedPay', (req, res, next) => {
  request.get({
    url: `/api/pay/public/unifiedPay?${querystring.stringify(req.query)}`,
    headers: {
      'Authorization': req.get("Authorization"),
      'User-Agent': req.get("User-Agent")
    }
  }).then(({ data }) => {
    res.json(data)
  }).catch(({ errmsg, name }) => {
    res.json({
      errmsg,
      name,
      code: '4XX',
    })
  })
})

module.exports = router
