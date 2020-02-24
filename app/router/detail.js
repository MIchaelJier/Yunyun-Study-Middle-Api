const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')

/*
* 获取课程相关的优惠券
* GET
* */
noHandle(router,
  'GET',
  '/getCoursedetail',
  '/api/course/public/detail',
  func = data => {
    let newData = {}
    newData.coupons = data.data.map( obj => {
      let newObj = {}
      newData.type = obj.type
      newObj.list = obj.map( inner => {
        let newInner = {}
        newInner.amount = inner.reduceAmount
        newInner.consumingThreshold = inner.achieveAmount
        newInner.couponId = inner.id
        newInner.targetName = inner.targetName
        newInner.isVip = 0
        newInner.ownerId = inner.a
        newInner.creatorName = inner.lecturerName
        newInner.creatorUrl = inner.a

        newInner.createTime = inner.a
        newInner.endTime = inner.a

        newInner.targetType = inner.scope
        newInner.targetId = inner.targetIdArray

        return newInner
      })
      return newData
    })

  })
/*
* 获取课程详情
* GET
* */
noHandle(router,
  'GET',
  '/getCoursedetail',
  '/api/course/public/detail',
  func = data => {
    let newData = {}
    newData.ownername = data.data.lecturer.lecturerName
    newData.ownerStudentNum = data.data.lecturer.ownerStudentNum
    newData.ownerPhotoUrl = data.data.lecturer.logoUrl

    newData.ownerId = data.data.lecturer.lecturerUserNo

    newData.photoUrl = data.data.courseLogo
    newData.productId = data.data.id
    newData.productName = data.data.courseName
    newData.oldPrice = data.data.courseOriginal
    newData.discountPrice = data.data.courseDiscount
    newData.deadlineTime = data.data.deadlineTime
    newData.rate = data.data.rank
    newData.tips = ["独家"]
    newData.learningNum = data.data.countStudy
    newData.discountTime = data.data.limitEndIn.replace(/-/g,'/')
    newData.coupons = data.data.couponReduceAmount === '' ? [{type: 2 , content:`减￥${data.data.couponReduceAmount}`}] : []
    newData.description = data.data.courseIntroduce.intendedFor + data.data.courseIntroduce.introduce + data.data.courseIntroduce.introduceImg

    newData.teachers = {
      name: data.data.lecturer.lecturerName,
      headImg: data.data.lecturer.logoUrl,
      teacherIntro: data.data.lecturer.introduction
    }
    data.data = newData
    return data
  })

module.exports = router
