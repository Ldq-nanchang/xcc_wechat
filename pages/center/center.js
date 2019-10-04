// pages/center/center.js
const $http = require("../../utils/request.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    has_mobile:false,
    userInfo: {},
    user_state: false
  },
  toFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    });
  },
  login(mobile) {
    let that = this;
    let head = {
      mobile: mobile,
      platform: '',
      versionCode: '',
      versionName: '',
      device: '',
      systemVersion: ''
    }
    wx.getSystemInfo({
      success: function (res) {
        head.platform = 'wechat' + ' ' + res.version;
        head.versionCode = '';
        head.versionName = '0.1.0';

        head.systemVersion = res.system;
        head.device = res.brand;

        console.log(res.system, res)
        that.login_(head);
      },
      fail: function() {
        that.login_(head);
      }
    })
  },
  login_(head) {
    let that = this;
    $http.login('/api/User/WechatLogin', head, {
        UserTypeCode: '',
        NickName: '',
        InviteCode: '',
      }, (res) => {
        console.log(res.data, res.data.data.F_Id)
        wx.setStorage({
          key: 'user',
          data: head.mobile + '|' + res.data.htoken + '|' + res.data.data.F_Id,
        });
        $http.initHtoken();
        let url = '';
        if (res.data.data.headpic.split('/')[0] == 'https:' || res.data.data.headpic.split('/')[0] == 'http:') {
          url = res.data.data.headpic
        } else {
          url = app.globalData.url_img + res.data.data.headpic
        }
        app.globalData.userInfo = {
          name: res.data.data.nickname,
          headpic: url,
          mobile: head.mobile
        }
        that.setData({
          userInfo: app.globalData.userInfo
        })
      })
  },
  share() {
    wx.updateShareMenu({
      withShareTicket: true,
      success() { }
    })
  },

  phoneLogin() {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.login(res.data.split('|')[0])
      },
    })
  },
  getPhoneNumber(e) {
    let that = this;
    that.getCode(e);
  },
  setCode() {
    console.log('set')
    wx.login({
      success: (res) => {
        wx.setStorage({
          key: 'code',
          data: res.code,
        })
      }
    })
  },
  getCode(e) {
    console.log('get')
    let that = this;
    wx.getStorage({
      key: 'code',
      success: function(res) {
        console.log(res.data)
        that.empower(e, res.data);
      },
    })
  },
  empower: function(e,code) {
    var that = this;
    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:user deny') {
      console.log('不同意授权')
      // that.setCode();
    } else {//同意授权
    console.log('同意授权')
        $http.requestNoHead('/api/WechatApp/GetWeixinOnLogin',{
          Code: code,
          IV: iv,
          EN: ency
        },(res)=>{
          // console.log(res.data.data);
          // console.log(JSON.parse(res.data.data).phoneNumber);
          wx.setStorage({
            key: 'user',
            data: JSON.parse(res.data.data).phoneNumber + '|',
          });
          that.login(JSON.parse(res.data.data).phoneNumber)
        })
    }  
  },
  checkCode() {
    let that = this;
    wx.getStorage({
      key: 'code',
      success: function(res) {
        console.log(res)
        wx.checkSession({
          success: function (res) {
            console.log(res)
            if (res.errMsg != 'checkSession:ok') {
              that.setCode();
            }
          },
          fail: function () {
            that.setCode();
          }
        })
      },
      fail: function() {
        that.setCode();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.hideShareMenu();
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(wx.getStorageSync('user'))
    
    if (wx.getStorageSync('user')) {
      that.setData({
        has_mobile: true
      });
    }else {
      that.setData({
        has_mobile: false
      });
    }
    this.checkCode();  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '校查查',
      path: '/pages/index/index',
      imageUrl: '/assets/share_img.jpg'
    }
  }
})