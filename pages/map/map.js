// pages/map/map.js
var amapFile = require('../../libs/amap-wx.js');
var markersData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {}
  },
  makertap: function (e) {
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },
  showMarkerInfo: function (data, i) {
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].regeocodeData.formatted_address
      }
    });
  },
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        // data[j].iconPath = "选中 marker 图标的相对路径"; 
      } else {
        // data[j].iconPath = "未选中 marker 图标的相对路径";
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let xy = options.xy;
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: '748ccff4e1275d70ea281f851edb61da' });
    myAmapFun.getRegeo({
      // iconPathSelected: '../../assets/home_ac.png',
      // iconPath: '../../assets/home_ac.png',
      width: '40rpx',
      height: '40rpx',
      location: xy,
      success: function(data) {
        console.log(data)
        markersData = data;
        that.setData({
          markers: markersData
        });
        that.setData({
          latitude: markersData[0].latitude
        });
        that.setData({
          longitude: markersData[0].longitude
        });
        that.showMarkerInfo(markersData, 0);
      },
      fail: function(info) {
        wx.showModal({ title: info.errMsg })
      }
    })

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