
const express = require('express')
const pick = require('object.pick')
const router = express.Router()

const request = require('./request/index')
const noHandle = require('./request/noHandle')

router.use('/user', require('./user')) //用户 模块 （登录、注册、手机验证码、V5验证相关）

router.use('/index', require('./indexPage')) // 首页

router.use('/search', require('./search')) // 搜索相关（热门搜索、搜索联想、搜索等）

router.use('/detail', require('./detail')) // 课程详情页

router.use('/cart', require('./coupon&cart')) // 购物车和优惠券 模块

module.exports = router
