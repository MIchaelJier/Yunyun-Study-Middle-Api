const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')
/*
* 获取分类
* GET
* */
noHandle(router,'GET','/getClassList','/api/course/category/public/getClassList')
/*
* 获取轮播图
* GET
* */
noHandle(router,'GET','/advList','/api/index/public/advList',func = data => {
  let newData = data
  newData.data = newData.data.map((obj, index) => {
    let newObj = {}
    newObj.id=index;
    newObj.picsrc = obj.advImg;
    return newObj
  })
  return newData
})
/*
* 获取专区课程
* GET
* */
noHandle(router,'GET','/list','/api/course/zone/public/list',func = data => {
  let newData = data
  newData.data = data.data.map( obj => {
    let newObj = {}
    newObj.id = obj.id
    newObj.title = obj.zoneName
    newObj.content = obj.zoneCourseVOList.map(inner => {
      let newInner = {}
      newInner.contentid = inner.id
      newInner.size = 1
      newInner.picsrc = inner.courseLogo
      newInner.name = inner.courseName
      newInner.oprice = inner.courseOriginal
      newInner.nprice = inner.courseDiscount
      return newInner
    })
    return newObj
  })
  return newData
})

module.exports = router
