
const express = require('express')
const pick = require('object.pick')

const { queryString, formatImageUrl, formatArrayQuery } = require('../utils/transformType')
const router = express.Router()

const request = require('./request/index')

router.get('/index/advList', (req, res, next) => {
  request.get({
    url: '/api/index/public/advList',
    data: req.body.data,
  }).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(({ errmsg, name }) => {
    res.json({
      errmsg,
      name,
      code: 1,
    })
  })
})


module.exports = router
