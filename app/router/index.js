
const express = require('express')
const axios = require('axios')
const pick = require('object.pick')

const { queryString, formatImageUrl, formatArrayQuery } = require('../utils')
const router = express.Router()

const baseUrl = 'https://zfroot.top:8081/yun'

const request = (method, url, cookie = "", data = {}, params = {}) => {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      data,
      params,
      headers: {
        Cookie: cookie
      },
    }).then(data => {
      resolve(data);
    }).catch(err => {
      console.log(err)
      const errmsg = err.response.data.message || err.toString()
      const name = err.response.data.name || ''
      reject({ errmsg, name })
    })
  })
}

router.get('/index/advList', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  request(
    'GET',
    `${baseUrl}/api/index/public/advList`,
    cookie,
    req.body.data
  ).then(({ data }) => {
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
