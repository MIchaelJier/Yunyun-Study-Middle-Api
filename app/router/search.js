const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')
const querystring = require('querystring')

/*
* 获取搜索结果
* POST
* */
router.post('/getSearchResult', (req, res, next) => {
  request.post({
    headers: {
      "Content-Type": req.get("Content-Type")
    },
    url: `/api/course/public/getSearchResult?${querystring.stringify(req.body)}`,
  })
    .then(({ data })=> {
      let newData = {};
      newData.searchsum = data.data.total
      newData.searchresult = data.data.records.map( obj => {
        let newObj = {}
        newObj.id = obj.id
        newObj.picsrc =  obj.courseLogo
        newObj.title =  obj.courseName
        newObj.url = obj.id
        newObj.star = obj.rank
        newObj.learned = obj.countStudy
        newObj.oprice = obj.courseOriginal
        newObj.nprice = obj.courseDiscount
        newObj.vipprice = ""
        return newObj
      })
      data.data = newData
      res.json(data)
    })
    .catch(({errmsg, name}) => {
      res.json({
        errmsg,
        name,
        code: 1,
      })
    })
})
module.exports = router
