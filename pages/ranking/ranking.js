// pages/ranking/ranking.js
const app = getApp();
var $http = require("../../utils/request.js");
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition: [],
    list: [],
    loading_state: true,
    condition_edit: {
      TypeCode: '',
      PeriodCode: '',
      ObjectCode: '',
    },
    page: 1,
    page_size: 10,
  },

  bindPickerChange(e) {
    // console.log('picker发送选择改变，携带值为',e.target.id, e.detail.value,e)
    let index = Number(e.target.id);
    let index_ = Number(e.detail.value);

    let that = this;
    let condition = that.data.condition;

    condition[index].condition_name = condition[index].condition_value[index_].ItemName;
    condition[index].condition_code = condition[index].condition_value[index_].ItemCode;
    that.setData({
      condition,
      condition_edit: {
        TypeCode: condition[0].condition_code,
        PeriodCode: condition[1].condition_code,
        ObjectCode: condition[2].condition_code,
      }
    })

   this.init_list();
  },

  init_list: function(is_first) {
    let that = this;
    that.setData({
      page: 1,
    })
    let data =  Object.assign(that.data.condition_edit,{
      CurrentPage: that.data.page,
      PageSize: that.data.page_size,
      OrderBy: ''
    })
    $http.request(true,'/api/School/GetRankList',data,(res)=>{
      console.log(res.data.datalist.length)
      if (res.data.datalist.length<that.data.page_size) {
        that.setData({
          loading_state: false
        })
      }
      for (let item of res.data.condition) {
        item.index = 0;
        item.condition_code = ''
      }
      if (is_first == 'is_first') {
        that.setData({
          condition: res.data.condition,
        })
      }
      that.setData({
        list: res.data.datalist
      })
    })
  },
  get_list: function() {
    let that = this;
    if (!that.data.loading_state) {
      return;
    }
    that.setData({
      page: that.data.page + 1
    })
    $http.request(true, '/api/School/GetRankList', {
      TypeCode: '',
      PeriodCode: '',
      ObjectCode: '',
      CurrentPage: that.data.page,
      PageSize: that.data.page_size,
      OrderBy: ''
    }, (res) => {
      if (res.data.datalis < that.data.page_size) {
        that.setData({
          loading_state: false
        })
      }
      that.setData({
        list: [...that.data.list, ...res.data.datalist]
      })
    })
  },
  toInfo: function(e) {
    wx.navigateTo({
      url: '/pages/web_view/web_view?url=/ranking_list&id='+e.currentTarget.dataset.item.F_Id,
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
    
    this.init_list('is_first');
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
    let condition_edit = this.data.condition_edit;
    Object.keys(condition_edit).forEach(function(key){
      condition_edit[key] = ''
    })
    this.init_list('is_first');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.get_list();
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