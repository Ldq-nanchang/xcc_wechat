/**
 * 后台接口请求封装
 */
// var app = getApp();
let mobile = '';
let htoken = '';

function initHtoken(callback) {
  wx.getStorage({
    key: 'user',
    success(res) {
      if(res.data) {
        mobile = res.data.split('|')[0];
        htoken = res.data.split('|')[1];
      }
      if(typeof callback == 'function') {
        callback()
      }
    },
    fail(err) {
      console.log(err)
    }
  })
}
initHtoken();

//项目URL相同部分，减轻代码量，同时方便项目迁移
//这里因为我是本地调试，所以host不规范，实际上应该是你备案的域名信息
// var host = 'http://223.84.156.187:806';
var host = 'http://223.84.156.187:812';
// var host = 'https://api.xcc-edu.com';

/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
let isOutTime = true;

function prompt(msg, status, times,callback) {
  wx.showToast({
    title: msg,
    icon: status,
    duration: times,
    success: function() {
      if(typeof callback == 'function') {
        callback();
      }
    }
  })
}
function request(loading, url, postData, doSuccess, doFail) {
  if (loading) {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    });
  }
  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: host + url,
    header: {
      "content-type": "application/x-www-form-urlencoded;",
      "Mobile": mobile,
      "HToken": htoken,
      "PlatformType": "wechat"
    },
    data: {
      json: JSON.stringify(postData)
    },
    method: 'POST',
    success: function (res) {
      //参数值为res.data,直接将返回的数据传入
      wx.hideLoading();
      wx.stopPullDownRefresh();
      isOutTime = false;
      if (res.data.status=='0000'&&typeof doSuccess == 'function') {
        doSuccess(res.data);
      }else if (res.data.status=='-1') {
        prompt(res.data.message,'none',2000)
      } else if (res.data.status == '1003' || res.data.status == '1002' || res.data.status == '1001') {
        let msg = mobile ? res.data.message : '该功能需要登录!';
        prompt(msg, 'none', 1000, () => {
          // 长时间未使用Htoken过期，更新用户信息
          if (getApp()) {
            getApp().globalData.userInfo = { name: "", headpic: "", mobile: ""}
            console.log(getApp().globalData.userInfo)
          }
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/center/center',
            })
          }, 1000);
        })
      }
    },
    fail: function (err) {
      if(typeof doFail == 'function') {
        doFail();
      } 
    },
    complete: function() {
      if (isOutTime) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        prompt('网络不稳定！', 'none', 1000);
      }
      isOutTime = true;
    }
  })
}

function requestNoHead(url, postData, doSuccess, doFail) {
  wx.request({
    url: host + url,
    header: {
      "content-type": "application/x-www-form-urlencoded;",
      "PlatformType": "wechat"
    },
    data: {
      json: JSON.stringify(postData)
    },
    method: 'POST',
    success: function (res) {
      isOutTime = false;
      if (res.data.status == '0000' &&typeof doSuccess == 'function') {
        doSuccess(res)
      } else if (res.data.status == '-1') {
        prompt(res.data.message, 'none', 2000)
      }
    },
    fail: function (err) {
      if (typeof doFail == 'function') {
        doFail();
      }
    },
    complete: function () {
      if (isOutTime) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        prompt('网络不稳定！', 'none', 1000);
      }
      isOutTime = true;
    }
  })
}

function login(url, head,postData, doSuccess, doFail) {
  wx.showLoading({
    title: '加载中',
    icon: 'loading',
  });
  wx.request({
    url: host + url,
    header: {
      "content-type": "application/x-www-form-urlencoded;",
      "Mobile": head.mobile,
      "PlatformType": "wechat",
      "platform": head.platform,
      "versionCode": head.versionCode,
      "versionName": head.versionName,
      "device": head.device,
      "systemVersion": head.systemVersion
    },
    data: {
      json: JSON.stringify(postData)
    },
    method: 'POST',
    success: function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      isOutTime = false;
      if (res.data.status == '0000' && typeof doSuccess == 'function') {
        doSuccess(res)
      } else if (res.data.status == '-1') {
        prompt(res.data.message, 'none', 2000)
      }
    },
    fail: function (err) {
      if (typeof doFail == 'function') {
        doFail();
      }
    },
    complete: function () {
      if (isOutTime) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        prompt('网络不稳定！', 'none', 1000);
      }
      isOutTime = true;
    }
  })
}

function getUserInfo(url, doSuccess, doFail) {
  wx.request({
    url: host + url,
    header: {
      "content-type": "application/x-www-form-urlencoded;",
      "Mobile": mobile,
      "HToken": htoken,
      "PlatformType": "wechat"
    },
    data: {
      json: JSON.stringify({ Mobile:mobile,HToken:htoken})
    },
    method: 'POST',
    success: function(res) {
      console.log(res,'request205')
      isOutTime = false;
      if (res.data.status == '0000' && typeof doSuccess == 'function') {
        doSuccess(res)
      } else if (res.data.status == '-1') {
        prompt(res.data.message, 'none', 2000)
      }
    },
    fail: function (err) {
      console.log(err, 'request214')
      if (typeof doFail == 'function') {
        doFail();
      }
    },
    complete: function () {
      if (isOutTime) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        prompt('网络不稳定！', 'none', 1000);
      }
      isOutTime = true;
    }
  })
}

/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js")  加载
 * 在引入引入文件的时候"  "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */
module.exports.request = request;
module.exports.initHtoken = initHtoken;
module.exports.getUserInfo = getUserInfo;
module.exports.requestNoHead = requestNoHead;
module.exports.login = login;



