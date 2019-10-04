// pages/teacher_search/teacher_search.js
var $http = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    page_size: 10,
    loading_state: true,
    condition_edit: {
      AreaCode: '',
      Sex: '',
      // goodsubject: '',
      SubjectCode: '',
      SchoolAge: '',
      OrderBy: ''
    },
    subject_code: '',
    condition: [],
    list: [],

  },
  goSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search?type_id=06',
    })
  },
  bindPickerChange: function (e) {
    let index = Number(e.target.id);
    let index_ = Number(e.detail.value);
    console.log(index,index_)
    let that = this;
    let condition = that.data.condition;

    condition[index].condition_name = condition[index].condition_value[index_].ItemName;
    condition[index].condition_code = condition[index].condition_value[index_].ItemCode;
    
    that.setData({
      condition,
      condition_edit: {
        AreaCode: '',
        Sex: condition[0].condition_code,
        // goodsubject: condition[1].condition_code,
        SubjectCode: condition[1].condition_code,
        SchoolAge: condition[2].condition_code,
        OrderBy: ''
      }
    });
    this.initList();
  },

  initList: function(is_first) {
    let that = this;
    if (is_first == 'is_first'&&!this.data.subject_code) {
      let condition_edit = that.data.condition_edit;
      for (let item of Object.keys(condition_edit)) {
        that.data.condition_edit[item] = '';
      }
      that.setData({ condition_edit})
    }
    that.setData({
      page: 1,
      loading_state: true,
    });
    let data = Object.assign(that.data.condition_edit,{
      CurrentPage: that.data.page,
      PageSize: that.data.page_size
    });
    console.log(data)
    $http.request(true, '/api/School/GetTeacherList', data,(res)=>{
      for (let item of res.data.condition) {
        item.index = 0;
        item.condition_code = ''
      }
      if(is_first=='is_first') {
        that.setData({
          condition: res.data.condition,
        })
      }
      that.setData({
        list: res.data.datalist,
      })
      if (res.data.datalist.length < that.data.page_size) {
        that.setData({
          loading_state: false
        });
      }
    })
  },

  getList: function() {
    let that = this;
    this.setData({
      page: that.data.page + 1
    });
    let data = Object.assign(that.data.condition_edit, {
      CurrentPage: that.data.page,
      PageSize: that.data.page_size
    });
    $http.request(true, '/api/School/GetTeacherList',data,(res)=>{
      let list = [...that.data.list,...res.data.datalist];
      that.setData({list});
      if (res.data.datalist.length < that.data.page_size) {
        that.setData({
          loading_state: false
        });
      }
    })
  },
   
  toInfo: function(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/web_view/web_view?url=/teacher_info&id=' + item.f_id + '&type_id=' + item.periodcode
    })
  },
  selectTag(e) {
    let condition_edit = this.data.condition_edit;
    condition_edit.SubjectCode = e.currentTarget.dataset.id;
    this.setData({ condition_edit });
    // this.updataCondition()
    this.initList();
  },
  initTage(id) {
    let condition_edit = this.data.condition_edit;
    condition_edit.SubjectCode = id;
    
    this.setData({ 
      condition_edit,
      subject_code: id 
    });
    this.initList();
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.tagcode)
    if (options.tagcode) {
      this.initTage(options.tagcode)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initList('is_first');
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
    this.initList('is_first');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    if (!this.data.loading_state) {
      return;
    }
    this.getList();
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