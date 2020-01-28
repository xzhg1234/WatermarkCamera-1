var util = require('../../utils/util.js');
Page({
  data: {
    camWidth:'',
    camHeight:'',
    camToImg:true,
    imgSrc:'/images/透明.png',
    orientation:true,
    date:'',
    time:'',
    remarks:'',
    remarksIpt:false,
    test:''
  },

  takePhoto:function() {
    var that = this
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        that.setData({
          imgSrc: res.tempImagePath,
          camToImg:false
        })
        const ctx = wx.createCanvasContext('canvasIn')
        ctx.drawImage(res.tempImagePath, 0, 0, that.data.camWidth / 2, that.data.camHeight/2)
        ctx.drawImage('/images/按钮.png', that.data.camWidth / 28, that.data.camHeight  / 3, that.data.camWidth / 4, that.data.camHeight / 14)
        ctx.setFontSize( that.data.camWidth / 32)
        ctx.fillText(that.data.date, 8+(that.data.camWidth / 14), (that.data.camWidth / 30 )+(that.data.camHeight / 3)+2)
        ctx.setFontSize(that.data.camWidth / 17)
        ctx.fillText(that.data.time, that.data.camWidth  *1.4/ 28, (that.data.camWidth / 15) + (that.data.camHeight / 3)+14 )
        ctx.draw()
      }
    })
    
    
  },

  remarksBtn: function(){
    var that = this
    that.setData({
      remarksIpt:true
    })
  },

  reShoot: function(){
    var that = this
    that.setData({
      camToImg:true
    })
  },

  waterDirect: function(){
    var that = this
    that.setData({
      orientation: !that.data.orientation
    })
  },

  savePhoto: function(){
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imgSrc,
    })
  },

  remarkIptValue:function(e){
    var that = this
    that.setData({
      test:e.detail.value,
      remarks: e.detail.value
    })
  },

  onLoad: function () {
    var that = this
    var dateTime = util.formatTime(new Date());
    var date = dateTime.substring(0,10)
    var time = dateTime.substring(11,19)
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          camWidth: res.screenWidth*2,
          camHeight: res.screenWidth*8/3,
          date: date,
          time: time
        })
      },
    })
  }
})