// components/school_list/school_list.js
var $http = require("../../utils/request.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    condition_edit: {
      type: Object
    },
    url: String,
    is_compare: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    first_show: true,
    scroll_top: 0,
    condition: [],
    loading_state: true,
    page: 1,
    page_size: 10,
    list: [],

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tomap: function(e) {
     let xy = e.currentTarget.dataset.item.x + ',' + e.currentTarget.dataset.item.y;
     wx.navigateTo({
       url: '/pages/map/map?xy='+xy,
     })
    },
    init_list: function(type) {
      let that = this;
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
      that.setData({
        first_show: false,
        scroll_top: 0,
        page: 1,
        loading_state: true
      })
      let data = Object.assign(that.data.condition_edit,{
        CurrentPage: that.data.page,
        PageSize: that.data.page_size,
        OrderBy: ''
      })
      $http.request(true,that.data.url,
      // {
      //   AreaCode: that.data.condition_edit.AreaCode,
      //   PeriodCode: that.data.condition_edit.PeriodCode,
      //   PropertyCode: that.data.condition_edit.PropertyCode,
      //   GroupCode: that.data.condition_edit.GroupCode,
      //   TagCode: that.data.condition_edit.TagCode,
      //   CurrentPage: that.data.page,
      //   PageSize: that.data.page_size,
      //   OrderBy: ''
      // }
      data
      ,(res)=>{
        if(type=='first') {
          for (let item of res.data.condition) {
            item.index = 0;
            item.condition_code = ''
          }
          that.setData({
            condition: res.data.condition,
          })
          that.getCondition();
        }
        if (res.data.datalist.length<that.data.page_size) {
          that.setData({
            loading_state: false
          });
        }
        that.setData({
          list: res.data.datalist,
        })  
      })
    },
    get_list: function () {
      let that = this;
      if (!that.data.loading_state) {
        return false;
      }

      this.setData({
        page: that.data.page + 1
      })
      if (!that.data.loading_state) {
        return false;
      }
      let data = Object.assign(that.data.condition_edit, {
        CurrentPage: that.data.page,
        PageSize: that.data.page_size,
        OrderBy: ''
      })
      $http.request(true, that.data.url, data, (res) => {
        if (res.data.datalist.length<that.data.page_size) {
          that.setData({
            loading_state: false
          })
        }
        that.setData({
          list: [...that.data.list,...res.data.datalist]
        })
      })
    },

    /**
     * 向父组件传参
     */
    getCondition() {
      let that = this;
      this.triggerEvent('getCondition', { condition: that.data.condition });
    },
    updataCondition() {
      let that = this;
      this.triggerEvent('updataCondition', { condition_edit: that.data.condition_edit });
    },
    selectSchool(e) {
      this.triggerEvent('clickSchool', { item: e.currentTarget.dataset.item })
    },
  
    // 集团筛选
    selectGroup(e) {
      let condition_edit = this.data.condition_edit;
      condition_edit.GroupCode = e.currentTarget.dataset.id;

      this.setData({ condition_edit });
      this.updataCondition()
      this.init_list();
    },

    // 标签筛选
    selectTag(e) {
      let condition_edit = this.data.condition_edit;
      condition_edit.TagCode = e.currentTarget.dataset.id;
      this.setData({ condition_edit });
      this.updataCondition()
      this.init_list();
    },
    initTage(id) {
      let condition_edit = this.data.condition_edit;
      condition_edit.TagCode = id;
      this.setData({ condition_edit });
      this.updataCondition()
      this.init_list();
    },


    /**
     * tab滚动加载
     */
    scrolltolower: function () {
      // this.get_list()
    },
    scroll: function () {

    },

    scrollBottom: function() {
      this.get_list()
    }
  },
  /**
   * 生命周期函数--在组件布局完成
   */
  ready: function () {
    // let that = this.data;
    // let list = [];
    // for(let item of new Array(5)) {
    //   list.push(that.list[0]);
    // }
    // this.setData({
    //   list: list,
    //   list_: list
    // })
    this.init_list('first');
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
      if (!this.data.first_show && this.data.list.length<1) {
        this.init_list('first')
      }
    },
    hide() { },
    resize() { },
  },
})
