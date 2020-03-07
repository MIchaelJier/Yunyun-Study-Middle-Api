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
        return {
          id : obj.id,
          picsrc : obj.courseLogo,
          title :  obj.courseName,
          url : obj.id,
          star : obj.rank,
          chapterNum: obj.periodTotal,
          learned : obj.countStudy,
          oprice : obj.courseOriginal,
          nprice : obj.courseDiscount,
          vipprice : ""
        }
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
