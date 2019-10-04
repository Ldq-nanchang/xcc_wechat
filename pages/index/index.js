//index.js
//获取应用实例
const app = getApp();
var $http = require("../../utils/request.js");
var util = require("../../utils/util.js")

Page({
  data: {
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
    city_index: 0,
    citys: [],
    hot: [],
    swiper:{des:'',index:''},
    swiper_leng: '',

    secondList: ["GFF", "GFF", "GFF", "GFF", "GFF", "GFF", "GFF"],
    search_shadow: false,
    // indicatorDots: false,
    // autoplay: true,
    // interval: 5000,
    // duration: 1000,
    tab_list: [{name:'热门',show:false}],
    tab_index: 0,
    head_h: 0,
    tab_fixed: false,
    scroll_h: '',
    swiper_h: '',

  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      city_index: e.detail.value
    })
  },


  //事件处理函数
  swiperChange: function(e) {
    let that = this;
    this.setData({
      swiper:{
        des: that.data.hot[Number(e.detail.current)].des,
        index: Number(e.detail.current) + 1,
      }
    })
  },
  onPageScroll: function(e) {
    let that = this.data;
    if (e.scrollTop>0) {
      this.setData({
        search_shadow: true
      });
    }else {
      this.setData({
        search_shadow: false
      });
    }
    if (that.head_h && e.scrollTop >= that.head_h && !that.tab_fixed) {
      this.setData({
        tab_fixed: true
      });

    } else if (e.scrollTop < that.head_h && that.tab_fixed) {
      this.setData({
        tab_fixed: false
      });

    }
  },
  // 轮播图跳转
  goInfo: function(e) {
    let url = e.currentTarget.dataset.url.split('#')[1].split('?');

    // let url_val = url[1].split('&').map(function(item){
      
    //   let arr = item.split('=');
    //   let obj = {
    //     name: arr[0],
    //     value: arr[1]
    //   }
    //   return obj
    // })
    // console.log(url_val)
    // return;

    wx.navigateTo({
      url: '/pages/web_view/web_view?url=' + url[0]+'&'+url[1],
    })
    
  },

  titleClick: function(e) {
    this.setData({
      tab_index: e.currentTarget.dataset.index
    })
    this.changePage();
  },
  pagechange: function (e) {

    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.tab_index
      currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        tab_index: currentPageIndex
      })
      this.changePage();
    }
  },
  changePage: function() {
    this.beforeInitInformation()
    let that = this;
    let component = "#informations" + this.data.tab_index;
    util.domH(component, (rect) => {
      that.setData({
        swiper_h: rect.height + 'px'
      })
    })
  },

  // 优选菜单跳转
  menuTo: function(e) {
    let item = e.currentTarget.dataset.item;
    if (item.menucode !='/pages/school_search/school_search') {
      wx.navigateTo({
        url: item.menucode,
      })
    }else {
      wx.navigateTo({
        url: item.menucode+'?type_id=' + (item.PeriodCode ? item.PeriodCode:'private'),
      })
    }
  },
  goSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search?type_id=01,02,03,04'
    })
  },
  // test01(res) {
  //   console.log(res,'res')
  // },
  // test02(err) {
  //   console.log(err,'err')
  // },

  /**
   * 生命周期函数
   */
  onLoad: function () {
    
    // // this.getMobile();
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    let that = this;
    this.setData({
      citys: app.golbalData.citys,
    });
    // console.log(app.globalData)
  },
  onReady() {
    // wx.navigateTo({
    //   url: '/pages/search_info/search_info?type_id=01&key_word=心',
    // })
    let xy = "115.953088, 28.697833";
    // wx.switchTab({
    //   url: '/pages/center/center',
    // })
    // wx.navigateTo({
    //   url: '/pages/feedback/feedback',
    // })
    this.get_index();
    //获取滚动加载高度
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.beforeInitInformation();
    this.clearCompare();
  },

  clearCompare: function() {
    app.globalData.compare.a = {};
    app.globalData.compare.b = {};
  },
  beforeInitInformation: function() {
    let tab_list = this.data.tab_list;
    if (!tab_list[this.data.tab_index].show) {
      tab_list[this.data.tab_index].show = true;
      this.setData({ tab_list });
      this.initInformation();
    }
  },
  initInformation: function() {
    let that = this;
    let component = "#informations" + this.data.tab_index;
    this.selectComponent(component).init_list('','','',() => {
      util.domH(component, (rect) => {
        that.setData({
          swiper_h: rect.height + 'px'
        })
      })
    }) 
  },
  get_index: function() {
    let that = this;
    $http.request(true,'/api/WechatApp/GetIndexMenu',{},(res)=>{
      let menu = util.arrayTransform(res.data.menu,4);
      that.setData({
        hot: res.data.hot,
        menu: menu,
        swiper: { des: res.data.hot[0].des, index: 1 },
        swiper_leng: res.data.hot.length
      })
      wx.nextTick(()=>{
        that.head_h();
      })
      
    })
  },
  head_h(dom,callback) {
    let that = this;
    util.domH('.index-head',(rect)=>{
      that.setData({
        head_h: rect.height
      })
    })
  },

/**
 * 下拉刷新监听函数
 */
  onPullDownRefresh: function () {
    this.get_index();
    let tab_list = this.data.tab_list;
    for(let item of tab_list) {
      item.show = false;
    }
    this.setData({
      tab_list,
      tab_index: 0
    });
    this.beforeInitInformation()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let component = "#informations" + this.data.tab_index;
    this.selectComponent(component).get_list('','','',()=>{
      util.domH(component,(rect)=>{
        that.setData({
          swiper_h: rect.height+'px'
        })
      })
    });
  },

  getMobile: function() {

  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
  },
})
