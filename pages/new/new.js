// pages/new/new.js
var util = require("../../utils/util.js");
const $http = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first_show: true,
    tab_list: [{name:'最新政策',show:false}, {name:'升学指导',show:false}, {name:'学校动向',show:false}, {name:'教育新闻',show:false}],
    tab_index: 0,
    swiper_h: '',
    tab_action: false
  },


  goSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search?type_id=09'
    })
  },
  /**
   * 点击事件函数
   */
  select_tab(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.setData({
      tab_index: e.currentTarget.dataset.index,
      tab_action: true
    });
    this.changePage();
  },
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = e.detail.current;
      this.setData({
        tab_index: currentPageIndex
      })
      this.changePage();
    }
  },
  changePage: function () {
    let tab_list = this.data.tab_list;
    if (!tab_list[this.data.tab_index].show) {
      this.beforeInitInformation()
    } else {
      let that = this;
      let component = "#informations" + this.data.tab_index;
      util.domH(component, (rect) => {
        that.setData({
          swiper_h: rect.height + 'px'
        })
      })
    }

  },
  getTab: function() {
    let that = this;
    $http.request(false,'/api/Information/GetInformationClassList',{},(res)=>{
      for(let item of res.data.datalist) {
        item.show = false;
      }
      that.setData({
        first_show: false,
        tab_list: res.data.datalist
      });
      this.beforeInitInformation()
    })
  },

  beforeInitInformation: function () {
    let tab_list = this.data.tab_list;
    tab_list[this.data.tab_index].show = true;
    this.setData({ tab_list });
    this.initInformation();
  },
  initInformation: function () {
    let that = this;
    let component = "#informations" + this.data.tab_index;
    this.selectComponent(component).init_list('', that.data.tab_list[that.data.tab_index].TypeCode, '', () => {
      util.domH(component, (rect) => {
        that.setData({
          swiper_h: rect.height + 'px'
        })
      })
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTab()
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
    let component = "#informations" + this.data.tab_index;
    console.log('eee', this.selectComponent(component))

    if (!this.data.first_show) {
      this.getTab();
    }
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
    this.getTab();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log(this.data.tab_action)
    // if (this.data.tab_action) {
    //   return;
    // }
    let that = this;
    let component = "#informations" + this.data.tab_index;
    this.selectComponent(component).get_list('', that.data.tab_list[that.data.tab_index].TypeCode,'',() => {
      util.domH(component, (rect) => {
        that.setData({
          swiper_h: rect.height + 'px'
        })
      })
    });
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