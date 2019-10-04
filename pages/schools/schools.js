// pages/schools/schools.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city_index: 0,
    citys: [],
    area_index:0,
    area: [{ id: 1, name: '全部' }, { id: 2, name: '东湖区' }, { id: 3, name: '西湖区' },],
    condition:[],
    condition_edit: {
      AreaCode: '',
      PeriodCode: '',
      PropertyCode: '',
      GroupCode: '',
      TagCode: '',
    },
  },
  goSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search?type_id=01,02,03,04'
    })
  },

  /**
   * 事件处理
   */
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
        AreaCode: condition[0].condition_code,
        PeriodCode: condition[1].condition_code,
        PropertyCode: condition[2].condition_code,
        GroupCode: that.data.condition_edit.GroupCode,
        TagCode: that.data.condition_edit.TagCode,
      }
    })

    that.selectComponent("#school-list").init_list();
  },
  /**
   * 获取子组件传来的condition
   */
  getCondition(e) {
    this.setData({
      condition: e.detail.condition
    })
  },
  updataCondition(e) {
    this.setData({
      condition_edit: e.detail.condition_edit
    })
  },

  // onReachBottom:function() {
  //   console.log('s')
  // },
  clickSchool(e) {
    let url = '';
    if (e.detail.item.periodcode == '05') {
      url = '/organization_info'

    } else {
      url = '/school_info'
    }
    wx.navigateTo({
      url: '/pages/web_view/web_view?url=' + url + '&id=' + e.detail.item.F_Id + '&type_id=' + e.detail.item.periodcode,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      citys: app.golbalData.citys
    });
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
    console.log('sss')
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
    this.setData({
      condition_edit: {
        AreaCode: '',
        PeriodCode: '',
        PropertyCode: '',
        GroupCode: '',
        TagCode: '',
      }
    })
    this.selectComponent("#school-list").init_list('first');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('s')
    this.selectComponent("#school-list").get_list();
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