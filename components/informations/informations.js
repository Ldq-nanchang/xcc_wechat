// components/informations/information.js
let app = getApp();
var $http = require("../../utils/request.js");
var util = require("../../utils/util.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    is_search: Boolean,
    is_new: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    loading_state: true,
    page: 1,
    page_size: 10,

  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
     
    },
    moved() { },
    detached() { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached() { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready() {

  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {

    },
    hide() {},
    resize() { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toInfo(e){
      let item = e.currentTarget.dataset.item;
      let id = '';
      if (item.F_Id) {
        id = item.F_Id;
      } else if (item.f_id) {
        id = item.f_id;
      }else if (item.id) {
        id = item.id;
      }
      wx.navigateTo({
        url: '/pages/web_view/web_view?url=/information_info&id=' + id + '&type_id=' + item.periodcode,
      });
    },
    init_list(key_word, type_code, period_code,listH) {
      let that = this;
      that.setData({
        // first_show: false,
        page: 1,
        loading_state: true,
        list: []
      });
      this.get_list(key_word, type_code,period_code,listH);
      // $http.request(false,'/api/Index/GetCycleInfoList',{
      //   TypeCode: '01',
      //   CurrentPage: that.data.page,
      //   PageSize: that.data.page_size,
      //   OrderBy: ''
      // },(res)=>{
      //   for (let item of res.data.datalist) {
      //     item.date = util.timeTransform(item.publishdate)
      //   }
      //   if (res.data.datalist.length < that.data.page_size) {
      //     that.setData({
      //       loading_state: false
      //     });
      //   }
      //   that.setData({
      //     list: res.data.datalist
      //   })
      //   if (typeof listH == 'function') {
      //     listH();
      //   }
      // })
    },
    get_list: function (key_word, type_code,period_code,listH) {
      let that = this;
      let url = '/api/Index/GetCycleInfoList';
      let data = {
        TypeCode: '01',
        CurrentPage: that.data.page,
        PageSize: that.data.page_size,
        OrderBy: ''
      }
      if(this.data.is_search) {
        url = '/api/index/GetPublicInfoSearch',
        data = {
          KeyWord: key_word,
          TypeCode: type_code,
          PeriodCode: period_code,
          CurrentPage: that.data.page,
          PageSize: that.data.page_size
        }
      } else if (this.data.is_new) {
        url = '/api/Information/GetInformationList',
          data = {
            KeyWord: key_word,
            TypeCode: type_code,
            // PeriodCode: period_code,
            CurrentPage: that.data.page,
            PageSize: that.data.page_size,
            OrderBy: ''
          }
      }
      if(!that.data.loading_state) {
        return false;
      }
      $http.request(true,url,data,(res)=>{
        for (let item of res.data.datalist) {
          item.date = util.timeTransform(item.publishdate ? item.publishdate : item.addtime)
        }
        if (res.data.datalist.length<that.data.page_size) {
          that.setData({
            loading_state: false
          })
        }
        that.setData({
          list: [...that.data.list,...res.data.datalist],
          page: that.data.page + 1
        })
        if (typeof listH == 'function') {
          listH();
        }
      })
    },
    /**
     * tab滚动加载
     */
    scrolltolower: function () {
      
    },
    scroll: function () {

    },
    scroll_state(state) {
      // this.setData({
      //   is_scroll: state
      // })
    }
  }
})
