// components/search_school/search_school.js
var $http = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    page_size: 10,
    list: [],
    loading_state: true
  },
  toSearchResult(e) {
    let item = e.currentTarget.dataset.item;
    console.log(item)
    let url = '';
    if (item.periodcode == '05') {
      url = '/organization_info'

    } else if (item.periodcode == '06'){
      url = '/teacher_info'
    } else {
      url = '/school_info'
    }
    wx.navigateTo({
      url: '/pages/web_view/web_view?url=' + url + '&id=' + item.id + '&type_id=' + item.periodcode,
    })
  },
  init_list(key_word, type_code, period_code, listH) {
    this.setData({
      page: 1,
      list: [],
      loading_state: true
    })
    this.get_list(key_word, type_code, period_code, listH);
  },
  get_list(key_word, type_code, period_code,listH) {
    if (!this.data.loading_state) {
      return;
    }
    let that = this;
    $http.request(true,'/api/index/GetPublicInfoSearch',{
      KeyWord: key_word,
      TypeCode: type_code,
      PeriodCode: period_code,
      CurrentPage: that.data.page,
      PageSize: that.data.page_size
    },(res)=>{
      for(let item of res.data.datalist) {
        if (item.periodcode=='06') {
          item.label = item.goodsubjectname.split(',')
        }
          
        
      }

      
      that.setData({
        page: that.data.page+1,
        list: [...that.data.list,...res.data.datalist]
      })
      if (typeof listH == 'function') {
        listH();
      }
      if(res.data.datalist.length<that.data.page_size) {
        that.setData({
          loading_state: false
        });
      }
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

  }
})