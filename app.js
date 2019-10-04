//app.js
const $http = require("./utils/request.js");
App({
  golbalData: {
    citys: ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
  
  },
  beforeUserInfo: function() {
    let that = this;
    if (wx.getStorageSync('user')) {
      $http.getUserInfo('/api/My/MyInfo', (res) => {
        console.log(res)
        if (res.data.status == '0000') {
          that.globalData.userInfo = { name: res.data.data.nickname, headpic: res.data.data.headpic, mobile: res.data.data.mobile }
        } else if (res.data.status == '1003') {
          that.globalData.userInfo = { name: '', headpic: '', mobile: '' }
        }
      })
    }else {
      that.globalData.userInfo = { name: '', headpic: '', mobile: '' }
    }
  },
  setCode() {
    console.log('set')
    wx.login({
      success: (res) => {
        wx.setStorage({
          key: 'code',
          data: res.code,
        })
      }
    })
  },

  onShow: function () {
    if (wx.getStorageSync('user')) {
      $http.initHtoken(()=>{
        this.beforeUserInfo();
      });
    }else{
      // this.setCode()
    }
  },
  onLaunch: function () {
    console.log('初始化' + wx.getStorageSync('user'))
    // if(!wx.getStorageSync('user')) {
    //   wx.setStorage({
    //     key: 'user',
    //     data: '',
    //   })
    // }
    $http.initHtoken();
  },
  globalData: {
    user: '',
    userInfo: {name: '',headpic:'',mobile:''},
    compare: { a: {}, b: {} },
    url_img: 'https://back.xcc-edu.com',
    // url_h5: 'https://front.xcc-edu.com/#'
    // url_h5: 'http://223.84.156.187:807/#',
    url_h5: 'http://223.84.156.187:813/#',
  },

})