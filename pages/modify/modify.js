var util = require('../../utils/util.js');
Page({

  data: {
    myTime:'',
    myDate:'',
    myRemarks:'',
    myAddress:'',
    timeValue:'',
    dateValue:'',
    remarksValue:'',
    addressValue:''
  },
  timeValue:function(e){
    var that = this
    wx.setStorage({
      key: 'timeValue',
      data: e.detail.value,
    })
  },
  dateValue: function (e) {
    var that = this
    wx.setStorage({
      key: 'dateValue',
      data: e.detail.value,
    })
  },
  remarksValue: function (e) {
    var that = this
    wx.setStorage({
      key: 'remarksValue',
      data: e.detail.value,
    })
  },
  addressValue: function (e) {
    var that = this
    wx.setStorage({
      key: 'addressValue',
      data: e.detail.value,
    })
  },
  yesTo:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  onLoad: function (options) {
    var that = this
    var dateTime = util.formatTime(new Date());
    that.setData({
      myDate: dateTime.substring(0, 10),
      myTime: dateTime.substring(11, 19),
      myRemarks: '属于我的时刻 -- 全能相机',
      myAddress: '我在这里',
    });
  },

})