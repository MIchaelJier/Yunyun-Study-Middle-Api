const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')
/*
* 判断 token 是否有效
* GET
* */
noHandle(router,'GET','/checkToken','/oauth/check_token')
/*
* 获取V5HOST和TOKEN信息
* GET
* */
noHandle(router,'GET','/getV5HostAndToken','/custom/getV5HostAndToken')
/*
* 判断V5id的正确性
* POST
* */
noHandle(router,'POST','/sendSmsVerify','/custom/sendSmsVerify')
/*
* 发送 给手机验证码
* GET
* */
noHandle(router,'GET','/sms','/custom/sms')
/*
* 注册
* POST
* */
noHandle(router,'POST','/register','/custom/register')
/*
* 修改用户信息
* POST
* */
noHandle(router,'POST','/setUserProfile','/api/user/setUserProfile')

/*
* 登录
* POST
* */
router.post('/login', (req, res, next) => {
  //登录
  let login = request.post({
    headers:{
      "Authorization":"Basic eXVuLWNsaWVudDp5dW4tc2VjcmV0LTg4ODg=",
      "Content-Type":req.get("Content-Type")
    },
    url: '/oauth/token',
    data: req.body, //raw格式请求
  })
  //获取用户信息
  let userInfo = data => {
    return new Promise((resolve, reject) => {
      if(data.status){
        request.get({
          headers:{
            "Authorization":`Bearer ${data.data.access_token}`,
          },
          url: `/api/user/getUserProfileByUserNo?userNo=${data.data.userNo}`,
        }).then( resp => {
          let copy = JSON.parse(JSON.stringify(resp.data.data))
          delete copy.nickName;
          delete copy.userName;
          delete copy.userAvatarUrl;
          delete copy.mobile;
          resp.data = {
            ...resp.data,
            data:{
              token:data.data.access_token,
              truepass:true,
              loginWay:1,
              id:data.data.userNo,
              nikename:resp.data.data.nickName,
              username:resp.data.data.userName,
              haedImage:resp.data.data.userAvatarUrl,
              phone:resp.data.data.mobile,
              ...copy
            }
          }
          resolve(resp)
        }).catch( err => {
          reject(err)
        })
      }else{
        resolve(data)
      }
    })
  }
  //整合接口
  login
    .then( resp => {
      // res.json(resp.data)
      return userInfo(resp.data)
    })
    .then( resp  => {
      if(resp.status){
        res.json(resp.data)
      }else{
        res.json(resp)
      }
    })
    .catch(({ errmsg, name }) => {
    res.json({
      errmsg,
      name,
      code: 1,
    })
  })
})

module.exports = router

