// pages/compare/compare.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    compare_a:{},
    compare_b:{}
  },

  selectSchool: function(e) {
    let that = this;
    let value = '';
    if (e.currentTarget.dataset.id=='a') {
      value = 'a|';
    } else if (e.currentTarget.dataset.id == 'b') {
      if (!this.data.compare_a.periodcode) {
        wx.showToast({
          title: '请选择第一所学校',
          icon: 'none',
          duration: 1000
        })
        return false;
      }

      value = 'b|' + this.data.compare_a.periodcode;
    }

    wx.redirectTo({
      url: '/pages/school_search/school_search?compare=' + value,
    })
  },

  // 全局状态管理
  initCompare(compare_a) {
    console.log('init')
    if (compare_a) {
      let arr = compare_a.split('|');
      app.globalData.compare.a = {
        F_Id: arr[0],
        shortname: arr[1],
        logo: arr[2],
        periodcode: arr[3]
      }
    }
    this.setData({
      compare_a: app.globalData.compare.a,
      compare_b: app.globalData.compare.b,
    })
  },
  toCompare() {
    let that = this;

    console.log(`/pages/web_view/web_view?url=/compare_result&schoola_id=${that.data.compare_a.F_Id}&schoolb_id=${that.data.compare_b.F_Id}&type_id=${that.data.compare_a.periodcode}`)
    if (that.data.compare_a.F_Id && that.data.compare_b.F_Id) {
      wx.navigateTo({
        url: `/pages/web_view/web_view?url=/compare_result&schoola_id=${that.data.compare_a.F_Id}&schoolb_id=${that.data.compare_b.F_Id}&type_id=${that.data.compare_a.periodcode}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCompare(options.compare_a);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // let compare_a = {
    //   shortname: '江西师大附中滨江校区',
    //   logo: 'http://223.84.156.187:808/Upload/System/201905171015.jpg',
    //   F_Id: '69b80655-e756-470e-923a-43d46c4dd2b6',
    //   periodcode: '03'
    // }
    // this.setData({compare_a});
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