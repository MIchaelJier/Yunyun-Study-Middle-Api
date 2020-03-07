const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')
const querystring = require('querystring')

const { timestampToTime } = require('../utils/transformType')
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
/*
* 取消订单
* POST
* */
noHandle(router,'POST','/cancelOrder','/api/order/cancelOrder')
/*
* 删除订单
* POST
* */
noHandle(router,'POST','/removeOrder','/api/order/removeOrder')
/*
* 获取 我的订单
* GET
* */
noHandle(router,'GET','/getOrder','/api/order/getOrder',func = data => {
  let newData = data.data
    .sort((a,b) => (b.gmtCreate - a.gmtCreate))
    .map( obj => {

    let list = [];
    obj.paidList.forEach( inner1 => {
      inner1.courseList.forEach( inner2 => {
        list.push({
          courseName: inner2.courseName ,
          deadlineTime: inner2.deadlineTime === '' ? 0 : inner2.deadlineTime ,
          nprice: inner2.courseDiscount ,
          oprice: inner2.courseOriginal ,
          productId: inner2.id ,
          photoUrl: inner2.courseLogo
        })
      })
    })

    return {
      orderId: obj.orderNo ,
      orderType: obj.orderStatus - 1 ,
      actuallyPaid: obj.pricePaid === '' ? '未支付' : obj.pricePaid ,
      tradeTime: timestampToTime(obj.gmtCreate),
      paidList: list ,
      payType: obj.payType
    }
  })
  data.data = newData
  return data
})

module.exports = router
