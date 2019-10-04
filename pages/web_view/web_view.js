// pages/web_view/web_view.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    title: '',
    name: '',
    share_url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    let url_ = '';
    for (let item of Object.keys(options)) {
      if (item != 'url') {
        url_ = url_ + item + '=' + options[item] + '&';
      }
    }
    console.log(wx.getStorageSync('user'))
    let arr = wx.getStorageSync('user').split('|');
    let user = 'user=' + arr[0] + ',' + arr[1] + ',' + arr[2]+ ',xcc-';    
    
    if (options.url) {
      this.setData({
        url: app.globalData.url_h5 + options.url + '?' + url_+user,
        share_url: '/pages/web_view/web_view?url='+options.url+'&'+url_+'share=1'
      })
    }
    console.log(this.data.share_url, options, this.data.url)

    let nav_title = '';
    switch (options.url) {
      case '/school_info':
        nav_title = '学校详情';
        break;
      case '/organization_info':
        nav_title = '机构详情';
        break;
      case '/information_info':
        nav_title = '新闻详情';
        break;
      case '/compare_result':
        nav_title = '对比结果';
        break;
    }
    this.setData({
      title: nav_title
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.setNavigationBarTitle({
      title: that.data.title,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {
    console.log(options)
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
    let that = this;
    return {
      title: that.data.name,
      path: that.data.share_url,
      // imageUrl: '/assets/share_img.jpg'
    }
  },

  onPageScroll: function (e) {
    console.log(e);//{scrollTop:99}
  }
})