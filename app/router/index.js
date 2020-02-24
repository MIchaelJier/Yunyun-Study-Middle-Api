
const express = require('express')
const pick = require('object.pick')

const { queryString, formatImageUrl, formatArrayQuery } = require('../utils/transformType')
const router = express.Router()

const request = require('./request/index')
const noHandle = require('./request/noHandle')

router.use('/user', require('./user')) //用户 模块 （登录、注册、手机验证码、V5验证相关）

router.use('/index', require('./indexPage')) // 首页

router.use('/search', require('./search')) // 搜索相关（热门搜索、搜索联想、搜索等）

module.exports = router
