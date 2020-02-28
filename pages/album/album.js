let cropper = null;
const ctx = wx.createCanvasContext('myCanvas')
Page({
  data: {
    myImg: '',
    urls: '',
    cropperOrImg: true,
    yesOrSave: true,
    windowWidth: '',
    windowHeight: '',
    imgWidth: '',
    imgHeight: '',
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        })
      },
    })
    that.setData({
      cropperOrImg: true,
      yesOrSave: true
    })
    wx.getStorage({
      key: 'selectImg',
      success: function (res) {
        cropper = that.selectComponent('#cropper');
        wx.getImageInfo({
          src: res.data[0],
          success: function(res) {
            that.setData({
              imgWidth: res.width,
              imgHeight: res.height,
            })
          }
        })
        setTimeout(function () {
          if (that.data.imgWidth >= that.data.imgHeight) {
            cropper.fnInit({
              imagePath: res.data[0],
              debug: true,
              outputFileType: 'jpg',
              quality: 1,
              aspectRatio: 1.33333333333333333333333333333333333333,
              minBoxWidthRatio: 0.2,
              minBoxHeightRatio: 0.2,
              initialBoxWidthRatio: 0.6,
              initialBoxHeightRatio: 0.6
            });
          } else {
            cropper.fnInit({
              imagePath: res.data[0],
              debug: true,
              outputFileType: 'jpg',
              quality: 1,
              aspectRatio: 0.75,
              minBoxWidthRatio: 0.2,
              minBoxHeightRatio: 0.2,
              initialBoxWidthRatio: 0.6,
              initialBoxHeightRatio: 0.6
            });
          }
        },200)
      },
    })
  },
  fnCancel: function () {
    console.log('cancel')
    wx.navigateBack({
      delta: 1
    })
  },
  fnSubmit: function () {
    var that = this
    wx.showLoading({
      title: '请耐心等待',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    cropper.fnCrop({
      success: function (res) {
        console.log(res.tempFilePath)
        that.setData({
          urls: res.tempFilePath,
          cropperOrImg: false,
          yesOrSave: false
        })
      },
    });
  },
  fnSave: function () {
    var that = this
    console.log(that.data.okImgHeight)
    wx.setStorage({
      key: 'OkImg',
      data: that.data.urls,
      success: function (res) {
        console.log(wx.getStorageSync('OkImg'))
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  }
})