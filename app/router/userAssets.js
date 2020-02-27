const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')
const querystring = require('querystring')

/*
* 获取 我的课程
* GET
* */
noHandle(router,'POST','/getMyCourses','/api/course/getMyCourses',func = data => {
  let newData = data.data.records.map( obj => {
    return {
      id: obj.courseId,
      picsrc: obj.courseLogo,
      name: obj.courseName,
      overProgress: obj.periodStudy,
      all: obj.periodTotal
    }
  })
  data.data = newData
  return data
})

module.exports = router
