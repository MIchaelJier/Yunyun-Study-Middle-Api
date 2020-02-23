
const express = require('express')
const pick = require('object.pick')

const { queryString, formatImageUrl, formatArrayQuery } = require('../utils/transformType')
const router = express.Router()

const request = require('./request/index');
const noHandle = require('./request/noHandle')
router.use('/user', require('./user')); //用户 模块 （登录、注册、手机验证码、V5验证相关）

noHandle(router,'GET','/index/advList','/api/index/public/advList')
module.exports = router
