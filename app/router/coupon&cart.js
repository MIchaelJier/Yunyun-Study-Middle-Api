const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')


/*
* 获取用户 所有优惠券
* GET
* */
noHandle(router,'GET','/getCoupon','/api/coupon/getUserCoupon',func = data => {
  let newData = data.data.map( obj => {
    return {
      used: obj.status === 1,
      amount: obj.couponDTO.reduceAmount,
      consumingThreshold: obj.couponDTO.achieveAmount === '0.00' ? 0 :  obj.couponDTO.achieveAmount,
      couponId: obj.couponDTO.id,
      creatorName: obj.couponDTO.lecturerName,
      creatorUrl: obj.couponDTO.lecturerUserNo,
      createTime: obj.startIn.substr(0,16),
      endTime: obj.endIn.substr(0,16),
      isVip: 0,
      ownerId: obj.couponDTO.lecturerUserNo,
      targetName: obj.couponDTO.targetName,
      targetType: parseInt(obj.couponDTO.scope),
      targetId: obj.couponDTO.scope == 2 ? obj.couponDTO.targetIdArray : obj.couponDTO.scope == 1 ? [obj.couponDTO.lecturerUserNo] : []
    }
  })
  data.data = newData
  return data
})
/*
* 用户 领取优惠券
* POST
* */
noHandle(router,'POST','/addCouponToUser','/api/coupon/addCouponToUser')
/*
* 添加 课程到 购物车
* POST
* */
noHandle(router,'POST','/addCartToUser','/api/cart/addCartToUser')
/*
* 删除 购物车 内的课程
* POST
* */
noHandle(router,'POST','/delCartToUser','/api/cart/delCartToUser')
/*
* 获取用户购物车信息
* GET
* */
noHandle(router,'GET','/getCart','/api/cart/getCart',func = data => {
  let total = 0
  let newData = {}
  newData.list = data.data.map( obj => {
    return {
      ownerDto: {
        ownerId: obj.ownerVO.lecturerUserNo ,
        ownername: obj.ownerVO.lecturerName ,
      } ,
      list: obj.courseList.map( inner => {
        total ++
        return {
          photoUrl: inner.courseLogo ,
          productId: inner.id ,
          productName: inner.courseName ,
          oldPrice: inner.courseOriginal ,
          discountPrice: inner.courseDiscount === '' ? inner.courseOriginal : inner.courseDiscount ,
          deadlineTime: inner.deadlineTime === '' ? 0 : inner.deadlineTime
        }
      })
    }
  })
  newData.total = total
  data.data= newData
  return data
})

module.exports = router
