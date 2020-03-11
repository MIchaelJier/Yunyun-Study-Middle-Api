const express = require('express')
const router = express.Router()
const request = require('./request/index')
const noHandle = require('./request/noHandle')
const querystring = require('querystring')
const { TimeDiff } = require('../utils/transformType')
/*
* 讲师课程推荐
* GET
* */
noHandle(router,'GET','/getGoodCourseList','mock/getGoodCourseList')
/*
* 讲师 轮播图
* GET
* */
noHandle(router,'GET','/getProviderSwiperList','mock/getProviderSwiperList')
/*
* 讲师 信息
* GET
* */
noHandle(router,'GET','/getproviderInfo','mock/getproviderInfo')

/*
* 更新课时最后学习时间 已学习过
* POST
* */
noHandle(router,'POST','/updateAlreadyLearnTime','/api/course/updatePeriodLastLearnTime')
/*
* 更新课时最后学习时间 没有学习过
* POST
* */
router.post('/updateLearnTime', (req, res, next) => {
  const headers = {"Authorization":req.get("Authorization")}
  let addStudyLog = request.post({
    headers,
    url:`/api/course/addStudyLog?${querystring.stringify(req.query)}`
  })
  let update =  request.post({
    headers,
    url:`/api/course/updatePeriodLastLearnTime?${querystring.stringify(req.query)}`
  })
  addStudyLog
    .then( res1 => {
      if(res1.data.status){
        return update
      }else{
        return new Promise((resolve, reject) => {resolve(res1)})
      }
    })
    .then( res2 => {
      res.json(res2.data)
    })
    .catch(({ errmsg, name }) => {
      res.json({
        errmsg,
        name,
        code: 1,
      })
    })
})
/*
* 加入免费课程
* POST
* */
noHandle(router,'POST','/addFreeCourse','/api/course/addFreeCourse')
/*
* 获取章节信息
* GET
* */
router.get('/getChapterlist', (req, res, next) => {
  const auth = req.get("Authorization")
  let requestWithAuth = url => {
    const requestBody = { url }
    auth ? requestBody.headers = {"Authorization": auth} : ''
    return request.get(requestBody)
  }
  //获取章节树
  let getList = requestWithAuth(`/api/course/chapter/public/list?${querystring.stringify(req.query)}`)
  //获取关联视频地址
  let getUrl = (isFree,periodId) => {
    return requestWithAuth(`/api/course/chapter/getCourseResource?${querystring.stringify(req.query)}&isFree=${isFree}&periodId=${periodId}`)
  }
  getList.then( ({ data }) => {
    let promiseArr = []
    let newData = data.data.map( obj => {
      return {
        chapterId: obj.id ,
        title: obj.chapterName ,
        body: obj.periodList.map( inner => {
          if(req.get("Authorization")){
            promiseArr.push( getUrl(inner.isFree, inner.id) )
          }
          return {
            id: inner.id,
            type: inner.isVideo === 1 ? 0 : inner.isDoc === 1 ? 2 : 1,
            name: inner.periodName ,
            tip: inner.isFree === 1 ? '可试看' : '',
            isStudy: inner.isStudy ,
            src: ''
          }
        })
      }
    })
    if(req.get("Authorization")){
      Promise.all(promiseArr).then( resp => {
        let flag = 0
        newData.forEach( item => {
          item.body.forEach(inner => {
            const innerData =  resp[flag].data.data
            inner.src = innerData[0] ? innerData[0].url ? innerData[0].url : ''  : ''
            flag ++
          })
        })
        data.data = newData
        res.json(
          data
        )
      })
    }else{
      data.data = newData
      res.json(data)
    }
  }).catch(({ errmsg, name }) => {
    res.json({
      errmsg,
      name,
      code: '4XX',
    })
  })
})

/*
* 获取 用户评论
* GET
* */
noHandle(router, 'GET', '/getUserComment', '/api/comment/getUserComment')
/*
* 添加 用户评论
* GET
* */
noHandle(router, 'POST', '/addComment', '/api/comment/addComment')
/*
* 获取评论区信息（加载更多）
* GET
* */
noHandle(router,
  'GET',
  '/getCommentsMore',
  '/api/comment/public/getComments',
  func = data => {
    let newData = {
      comments: comments(data.data.commentVOIPage.records)
    }
    data.data = newData
    return data
  })
/*
* 获取评论区信息（第一次）
* GET
* */
noHandle(router,
  'GET',
  '/getComments',
  '/api/comment/public/getComments',
  func = data => {
      let newData = {
        rate: {
          allRate: data.data.rate.averageRate,
          allNum: data.data.rate.totalNum,
          star: data.data.rate.star.reverse()
        },
        comments: comments(data.data.commentVOIPage.records)
      }
      data.data = newData
      return data
  })
const comments = data => {
  return data.map( obj => {
    return {
      date : obj.gmtModified.substr(0,10),
      headimg : obj.userAvatarUrl,
      nikename : obj.nickName,
      prog : obj.periodStudy,
      rate : obj.evaluationRank.toString(),
      content : obj.evaluationContent,
      reply : '',
      replydate : ''
    }
  })
}
/*
* 获取课程相关的优惠券
* GET
* */
noHandle(router,
  'GET',
  '/getCourseCoupon',
  '/api/course/public/getCourseCoupon',
  func = data => {
    let newData = {
      coupons:  data.data.map( obj => {
        return {
          type : obj.type,
          list : obj.list
            .filter( inner => TimeDiff(inner.endIn)||inner.endIn === '' )
            .map( inner => {
              let newInner = {
                amount : inner.reduceAmount ,
                consumingThreshold : inner.achieveAmount ,
                couponId : inner.id ,
                targetName : inner.targetName ,
                isVip : 0 ,
                ownerId: inner.lecturerUserNo ,
                creatorName : inner.lecturerName ,
                creatorUrl : inner.lecturerUserNo ,
                targetType : parseInt(inner.scope),
                targetId : inner.scope == 2 ? inner.targetIdArray : inner.scope == 1 ? [inner.lecturerUserNo] : []
              }

              if(inner.startAt !== '' && inner.endIn !== ''){
                newInner.createTime = inner.startAt.replace(/-/g,'/').substr(0,10)
                newInner.endTime = inner.endIn.replace(/-/g,'/').substr(0,10)
              }else if(inner.days !== ''){
                newInner.saveTime = inner.days
              }
              return newInner
          })
        }
      })
    }
    data.data = newData
    return data
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
    let newData = {
      ownername : data.data.lecturer.lecturerName ,
      ownerStudentNum : data.data.lecturer.ownerStudentNum ,
      ownerPhotoUrl : data.data.lecturer.logoUrl ,

      ownerId : data.data.lecturer.lecturerUserNo ,

      photoUrl : data.data.courseLogo ,
      productId : data.data.id ,
      productName : data.data.courseName ,
      oldPrice : data.data.courseOriginal ,
      discountPrice : data.data.courseDiscount ,
      deadlineTime : data.data.deadlineTime === '' ? 0 : data.data.deadlineTime ,
      rate : data.data.rank ,
      tips : ["独家"] ,
      learningNum : data.data.countStudy ,
      discountTime : data.data.limitEndIn.replace(/-/g,'/') ,
      coupons : data.data.couponReduceAmount === '' ?   []:[{type: 0 , content:`减￥${data.data.couponReduceAmount}`}] ,
      description : data.data.courseIntroduce.intendedFor + data.data.courseIntroduce.introduce + data.data.courseIntroduce.introduceImg ,
      teachers : [{
        name: data.data.lecturer.lecturerName,
        headImg: data.data.lecturer.logoUrl,
        teacherIntro: data.data.lecturer.introduction
      }],

      isFree : data.data.isFree,
      isOwn : data.data.isOwn
    }
    data.data = newData
    return data
  })

module.exports = router
