// pages/school_search/school_search.js

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city_index: 0,
    citys: [],
    type_id: '',
    url: '',
    is_compare: '',
    condition: [],
    condition_edit: {
      AreaCode: '',
      PeriodCode: '',
      PropertyCode: '',
      GroupCode: '',
      TagCode: '',
    },
  },
  goSearch: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/search/search?type_id=' + that.data.type_id
    })
  },
  /**
   * 事件处理
   */
  bindPickerChange(e) {
    // console.log('picker发送选择改变，携带值为',e.target.id, e.detail.value,e)
    let that = this;
    let index = Number(e.target.id);
    let index_ = Number(e.detail.value);

    console.log(that.data.condition)
    let condition = that.data.condition;
    condition[index].condition_name = condition[index].condition_value[index_].ItemName;
    condition[index].condition_code = condition[index].condition_value[index_].ItemCode;

    let condition_edit = {};
    if (that.data.type_id == '01' || that.data.type_id == '02' || that.data.type_id == '03' || that.data.type_id == 'private' || !that.data.type_id) {
      condition_edit= {
        AreaCode: condition[0].condition_code,
        PeriodCode: condition[1].condition_code,
        PropertyCode: condition[2].condition_code,
        GroupCode: that.data.condition_edit.GroupCode,
        TagCode: that.data.condition_edit.TagCode,
      }
    } else if (that.data.type_id == '04') {
      condition_edit = {
        TypeCode: condition[0].condition_code,
        PropertyCode: condition[1].condition_code,
        DemoCode: condition[2].condition_code,
        TagCode: that.data.condition_edit.TagCode,
      }
    } else if (that.data.type_id == '05') {
      condition_edit = {
        AreaCode: condition[0].condition_code,
        TypeCode: condition[1].condition_code,
        ScoreSort: condition[2].condition_code,
        TagCode: that.data.condition_edit.TagCode,
      }
    }
    
    that.setData({
      condition,
      condition_edit
    })

    that.selectComponent("#school-list").init_list();
  },
  /**
   * 获取子组件传来的condition
   */
  getCondition(e) {
    let that = this;
    let condition = e.detail.condition;
    let condition_name = '';
    console.log(that.data.type_id)
    switch(that.data.type_id) {
      case '01':
        condition_name = '小学';
        break;
      case '02':
        condition_name = '初中';
        break;
      case '03':
        condition_name = '高中';
        break;
      case 'private':
        condition[2].condition_name = '私立';
        condition[2].condition_code = '02';
    }
    if (condition_name) {
      condition[1].condition_name = condition_name;
      condition[1].condition_code = that.data.type_id;
    }
    this.setData({
      condition
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
  // 首页菜单点击进入
    fromMenu(options) {
      console.log(options);
    if (options.type_id != '04' && options.type_id != '05') {

      let condition_edit = this.data.condition_edit;
      if (options.tagcode) {
        condition_edit.TagCode = options.tagcode;
      }
      switch (options.type_id) {
        case '01':
          condition_edit.PeriodCode = options.type_id;
          break;
        case '02':
          condition_edit.PeriodCode = options.type_id;
          break;
        case '03':
          condition_edit.PeriodCode = options.type_id;
          break;
        case 'private':
          condition_edit.PropertyCode = '02';
          break;
      }
      this.setData({
        condition_edit,
        url: '/api/School/GetSchoolList'
      })

    } else if (options.type_id == '04') {
      let condition_edit = {
        TypeCode: '',
        PropertyCode: '',
        DemoCode: '',
        TagCode: options.tagcode ? options.tagcode : ''
      }

      this.setData({
        condition_edit,
        url: '/api/School/GetTechnicalList'
      })
    } else if (options.type_id == '05') {
      let condition_edit = {
        AreaCode: '',
        TypeCode: '',  
        ScoreSort: '',
        TagCode: options.tagcode ? options.tagcode : ''
      }
      this.setData({
        condition_edit,
        url: '/api/School/GetTrainList'
      })
    }
  },
  // 比一比点击进入
  fromCompare(options){
    let compare = options.compare.split('|');
    if (compare[0] == 'b') {
      let condition_edit = this.data.condition_edit;
      condition_edit.PeriodCode = compare[1];
      this.setData({
        url: '/api/School/GetSchoolList',
        is_compare: 'b',
        condition_edit
      })
      
    }else if (compare[0] == 'a') {
      this.setData({
        is_compare: 'a',
        url: '/api/School/GetSchoolList'
      });
    }
  },
  // 点击学校列表
  clickSchool(e) {
    let that = this;
    let item = {
      F_Id: e.detail.item.F_Id,
      periodcode: e.detail.item.periodcode,
      shortname: e.detail.item.shortname,
      logo: e.detail.item.logo,
    };
    if (that.data.is_compare=='a'){
      
      if (item.periodcode != app.globalData.compare.b.periodcode) {
        app.globalData.compare.b = {};
      }else {
        if(item.F_Id == app.globalData.compare.b.F_Id) {
          wx.showToast({
            title: '该学校已加入对比',
            icon: 'none',
            duration: 1000
          })
          return;
        }
      }
      app.globalData.compare.a = item;
    } else if (that.data.is_compare == 'b') {
      if (item.F_Id == app.globalData.compare.a.F_Id) {
        wx.showToast({
          title: '该学校已加入对比',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      app.globalData.compare.b = item;
    }
    
    if(this.data.is_compare) {
      wx.redirectTo({
        url: '/pages/compare/compare'
      })
    }else {
      let url = '';
      if(e.detail.item.periodcode=='05') {
        url = '/organization_info'

      }else {
        url = '/school_info'
      }
      console.log('/pages/web_view/web_view?url=' + url + '&id=' + e.detail.item.F_Id + '&type_id=' + e.detail.item.periodcode)
      wx.navigateTo({
        url: '/pages/web_view/web_view?url=' + url + '&id=' + e.detail.item.F_Id + '&type_id=' + e.detail.item.periodcode,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type_id) {
      this.setData({
        type_id: options.type_id
      })
      this.fromMenu(options);
    }

    if(options.compare) {
      this.fromCompare(options)
    }
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
    let condition_edit = this.data.condition_edit;
    let that = this;
    Object.keys(condition_edit).forEach(function (key) {
      condition_edit[key] = '';
      condition_edit['PeriodCode'] = that.data.type_id == 'private' ? '' : that.data.type_id;
      condition_edit['PropertyCode'] = that.data.type_id =='private'?'02':''
    }); 
    this.setData({
      condition_edit
    })
    console.log(this.data.condition_edit)
    this.selectComponent("#school-list").init_list('first');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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