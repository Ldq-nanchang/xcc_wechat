// pages/search/search.js
const $http = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key_word: '',
    page: 1,
    page_size: 16,
    search_state: false,
    list: [],
    loading_state: true,
    history_word: [],
    host_word: []
  },
  search: function(e) {
    this.setData({
      search_state: true,
      loading_state: true,
      page: 1
    })
    if (!e.detail.value) {
      this.setData({
        search_state: false
      })
      return;
    }
    this.initWord(e.detail.value);
  },
  initWord: function(key_word) {
    let that = this;
    $http.request(false,'/api/index/GetMathKeywords',{
      KeyWord: key_word,
      CurrentPage: that.data.page,
      PageSize: that.data.page_size
    },(res)=>{
      let list = res.data.datalist;
      that.setData({ list, key_word});
      if(list.length < that.data.page_size) {
        that.setData({
          loading_state: false
        })
      }
    })
  },
  getWord: function() {
    let that = this;
    that.setData({
      page: that.data.page + 1
    });
    $http.request(true, '/api/index/GetMathKeywords',{
      KeyWord: that.data.key_word,
      CurrentPage: that.data.page,
      PageSize: that.data.page_size
    },(res)=>{
      that.setData({
        list: [...that.data.list,...res.data.datalist]
      })
      if (res.data.datalist < that.data.page_size) {
        that.setData({
          loading_state: false
        })
      }
    })
  },
  toInfo: function(e) {
    let that = this;
    wx.redirectTo({
      url: '/pages/search_info/search_info?key_word=' + e.currentTarget.dataset.item.id + '&type_id=' + that.data.type_id,
    })
  },
  toInfoBtn: function() {
    let that = this;
    wx.redirectTo({
      url: '/pages/search_info/search_info?key_word=' + that.data.key_word + '&type_id=' + that.data.type_id,
    })
  },
  toInfoLabel: function(e) {
    let that = this;
    wx.redirectTo({
      url: '/pages/search_info/search_info?key_word=' + e.currentTarget.dataset.word + '&type_id=' + that.data.type_id,
    })
  },
  clearHistory: function() {
    let that = this;
    wx.clearStorage({
      success(res){
        that.setData({
          history_word: []
        })
      },
      fail(err) {

      }
    })
  },
  getHistory: function () {
    let that = this;
    wx.getStorage({
      key: 'search_word',
      success(res) {
        that.setData({
          history_word: JSON.parse(res.data)
        })
      }
    })
  },
  getHost: function() {
    let that = this;
    $http.request(false,'/api/index/GetHotKeyword',{},(res)=>{
      that.setData({
        host_word: res.data.datalist
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type_id = options.type_id;
    if (type_id == 'private') {
      type_id = '01,02,03,04'
    }
    this.setData({
      type_id: type_id
    });
    this.getHistory();
    this.getHost();
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
    if (!this.data.loading_state) {
      return
    }
    this.getWord();
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