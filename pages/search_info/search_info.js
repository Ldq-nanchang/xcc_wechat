// pages/search_info/search_info.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_id: '',
    key_word: '',
    navs: [
      { TypeName: '学校', TypeCode: 'School', show:false }, 
      { TypeName: '机构', TypeCode: 'Train', show: false }, 
      { TypeName: '资讯', TypeCode: 'Information', show: false },
      { TypeName: '名师', TypeCode: 'Teacher', show: false },
    ],
    nav_index: 0,
    swiper_h: ''

  },
  search: function(e){
    this.setData({
      key_word: e.detail.value
    });
    this.init();
  },
  toSearch: function() {
    let that = this;
    wx.redirectTo({
      url: '/pages/search/search?type_id=' + that.data.type_id
    });
  },
  clickNav: function(e) {

    this.setData({
      nav_index: e.currentTarget.dataset.index
    })
    this.changePage();
  },
  /** 
   * tab切换
   * **/
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = e.detail.current;
      this.setData({
        nav_index: currentPageIndex
      })
      this.changePage();
    }
  },
  changePage: function () {
    let navs = this.data.navs;
    if (!navs[this.data.nav_index].show) {
      this.beforeInit(navs)
    }else {
      let that = this;
      let component = '#' + this.data.navs[this.data.nav_index].TypeCode;
      util.domH(component, (rect) => {
        console.log(rect)
        that.setData({
          swiper_h: rect.height + 'px'
        })
      })
    }

  },


  beforeInit: function (navs) {
    navs[this.data.nav_index].show = true;
    this.setData({ navs });
    this.init();
  },
  init: function () {
    let that = this;
    let component = '#' +this.data.navs[this.data.nav_index].TypeCode;
    this.selectComponent(component).init_list(
      that.data.key_word, that.data.navs[that.data.nav_index].TypeCode, that.data.type_id
      ,() => {

      util.domH(component, (rect) => {
        that.setData({
          swiper_h: rect.height + 'px'
        })
      })
    })
  },

  saveKeyWord: function(key_word) {
    wx.getStorage({
      key: 'search_word',
      success(res) {
        let arr = JSON.parse(res.data)
        console.log(arr)
        arr.unshift(key_word[0]);
        for(let i=1;i<arr.length;i++) {
          if (arr[i]==key_word[0]) {
            arr.splice(i,1);
            break;
          }
        }
        wx.setStorage({
          key: 'search_word',
          data: JSON.stringify(arr),
        })
      },
      fail(err) {
        wx.setStorage({
          key: 'search_word',
          data: JSON.stringify(key_word)
        })
      }

    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.saveKeyWord([options.key_word]);

    let type_id = options.type_id;
    let navs = this.data.navs;
    let nav_index = 0;
    if (type_id=='01,02,03,04'||type_id == '01' || type_id == '02' || type_id == '03' || type_id == '04') {
      navs[0].show = true;
      nav_index = 0;
    } else if (type_id == '05') {
      navs[1].show = true;
      nav_index = 1;
    } else if (type_id == '09') {
      navs[2].show = true;
      nav_index = 2;
    }else if (type_id == '06') {
      navs[3].show = true;
      nav_index = 3;
    }
    this.setData({
      type_id: options.type_id,
      key_word: options.key_word,
      navs,
      nav_index
    });
    this.init();
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
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let component = '#' + this.data.navs[that.data.nav_index].TypeCode;
    this.selectComponent(component).get_list(that.data.key_word, that.data.navs[that.data.nav_index].TypeCode, that.data.type_id, () => {
      util.domH(component, (rect) => {
        that.setData({
          swiper_h: rect.height + 'px'
        })
      })
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
  }
})