// pages/feedback/feedback.js
const $http = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    mobile: '',
    email: '',
    des: ''
  },
  changeName: function(e) {
    if (e.detail.value) {
      this.setData({
        name: e.detail.value
      })
    }
  },
  changeMobile: function (e) {
    if (e.detail.value) {
      this.setData({
        mobile: e.detail.value
      })
    }
  },
  changeEmail: function (e) {
    if (e.detail.value) {
      this.setData({
        email: e.detail.value
      })
    }
  },
  changeDes: function (e) {
    if (e.detail.value) {
      this.setData({
        des: e.detail.value
      })
    }
  },
  postFeedback: function() {
    if (!this.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (!(/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/.test(this.data.email))) {
      wx.showToast({
        title: '请输入正确邮箱地址',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (!this.data.des) {
      wx.showToast({
        title: '请输入提交的信息',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    let that = this;
    $http.request(true,'/api/Index/SaveContactUs',{
      username: that.data.name,
      telephone: that.data.mobile,
      email: that.data.email,
      des: that.data.des
    },(res)=>{
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        success: function() {
          setTimeout(()=>{
            wx.navigateBack({ delta: 1 })
          },1000)
        }
      })  
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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