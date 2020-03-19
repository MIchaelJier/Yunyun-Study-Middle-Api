const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')

/*
* 讲师课程推荐
* GET
* */
noHandle(router,'GET','/getGoodCourseList','/api/course/zone/public/list',func = data => {
  let newData = data
  newData.data = data.data.map( obj => {
    let newObj = {}
    newObj.id = obj.id
    newObj.title = obj.zoneName
    newObj.content = obj.zoneCourseVOList.map(inner => {
      return {
        contentid : inner.id,
        size : inner.size,
        star : inner.rank,
        learned : inner.countStudy || 0,
        picsrc : inner.courseLogo,
        name : inner.courseName,
        oprice : inner.courseOriginal,
        nprice : inner.courseDiscount,
        chapterNum :  '1+',
        isShowInapp: inner.isShowInapp
      }
    })
    return newObj
  })
  return newData
})
/*
* 讲师 轮播图
* GET
* */
noHandle(router,'GET','/getProviderSwiperList','/api/course/zone/public/list',func = data => {
  let newData = [] ,
      key = 0
  data.data.forEach( obj => {
    obj.zoneCourseVOList.forEach(inner => {
      if(newData.length < 5){
        newData.push({
          id : key,
          courseId : inner.id,
          picsrc : inner.courseLogo
        })
        key ++
      }
    })
  })
  data.data = newData;
  return data;
})
/*
* 讲师 信息
* GET
* */
noHandle(router,'GET','/getproviderInfo','/api/lecturer/public/getLecturer',func = data => {
  data.data = {
      logoSrc: data.data.logoUrl,
      providername : data.data.lecturerName,
      companyName : '芸云课堂认证讲师',
      studentNum: data.data.ownerStudentNum
    }
  return data
})


module.exports = router
