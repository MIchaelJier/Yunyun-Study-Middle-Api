const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')
/*
* 获取分类
* GET
* */
noHandle(router,'GET','/getClassList','/api/course/category/public/getClassList',func = data => {
  // data.data.forEach(obj => {
  //   return {
  //     id: obj.id,
  //     titile : obj.categoryName,
  //     picsrc :
  //   }
  // })
})
/*
* 获取轮播图
* GET
* */
noHandle(router,'GET','/advList','/api/index/public/advList',func = data => {
  let newData = data
  newData.data = newData.data.map((obj, index) => {
    return  {
      id : index,
      picsrc : obj.advImg
    }
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
      return {
        contentid : inner.id,
        size : 1,
        picsrc : inner.courseLogo,
        name : inner.courseName,
        oprice : inner.courseOriginal,
        nprice : inner.courseDiscount
      }
    })
    return newObj
  })
  return newData
})

module.exports = router
