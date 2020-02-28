var util = require('../../utils/util.js');
const ctx = wx.createCanvasContext('myCanvas')
Page({
  data: {
    windowWidth: '',//小程序宽度
    windowHeight: '',//小程序高度
    camFlash: false,
    camOrientation:true,//判断摄像头朝向
    dateTime:'',
    myDate:'',
    myTime:'',
    myRemarks: '属于我的时刻 -- 全能相机',
    myAddress: '我在这里',
    imageUrl:'',
    camView:true,
    takephoto:true,
    i:'',
    j:'',
    myTimeDateRemarksAddress:false,
    disSave:true,
    disDirection:false,
    waterDirect:true,
    myStart:''
  },
  camFlashBtn:function(){
    var that = this
    that.setData({
      camFlash: !that.data.camFlash
    })
  },
  saveBtn:function(){
    var that = this
    that.setData({
      myTimeDateRemarksAddress: true,
      disDirection:true
    })
    ctx.clearRect(0, 0, that.data.windowWidth, that.data.windowWidth * 4 / 3)
    ctx.draw()

    ctx.setShadow(0, 0, 3, 'black')
    ctx.drawImage('/images/位置标记.png', that.data.windowWidth * 15 / 375, that.data.windowWidth * 75 / 375 + 30, that.data.windowWidth * 15 / 375, that.data.windowWidth * 15 / 375)
    ctx.setFillStyle('white')
    ctx.setFontSize(that.data.windowWidth * 45 / 375)
    ctx.setTextAlign('left')
    ctx.setTextBaseline('top')
    ctx.fillText(that.data.myTime, that.data.windowWidth * 15 / 375, 10)

    ctx.setFontSize(that.data.windowWidth * 15 / 375)
    ctx.setTextAlign('left')
    ctx.setTextBaseline('top')
    ctx.fillText(that.data.myDate, that.data.windowWidth * 15 / 375, that.data.windowWidth * 45 / 375 + 15)
    ctx.fillText(that.data.myRemarks, that.data.windowWidth * 15 / 375, that.data.windowWidth * 60 / 375 + 22.5)
    ctx.fillText(that.data.myAddress, that.data.windowWidth * 30 / 375, that.data.windowWidth * 75 / 375 + 30)
    ctx.draw(false, function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          console.log(res.tempFilePath)
          that.setData({
            myStart: res.tempFilePath
          })
          ctx.drawImage(that.data.imageUrl, 0, 0, that.data.windowWidth, that.data.windowWidth * 4 / 3)
          if (that.data.waterDirect){
            ctx.drawImage(that.data.myStart, 0, that.data.windowWidth, that.data.windowWidth, that.data.windowWidth * 4 / 3)
          }else{
            ctx.translate(that.data.windowWidth / 3, 0)
            ctx.rotate(90 * Math.PI / 180)
            ctx.drawImage(that.data.myStart, 0, 0, that.data.windowWidth, that.data.windowWidth * 4 / 3)
          }
          ctx.draw(false, function () {
            setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: 'myCanvas',
              success: function (res) {
                wx.showLoading({
                  title: '保存相册中',
                })
                setTimeout(function () {
                  console.log(res.tempFilePath)
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                  })
                  wx.hideLoading()
                  wx.showToast({
                    title: '保存成功',
                  })
                  ctx.clearRect(0, 0, that.data.windowWidth, that.data.windowWidth * 4 / 3)
                  ctx.draw(false, function () {
                      setTimeout(function () {
                        that.reTakePhoto()
                      },500)
                    }
                  )
                }, 500)
              },
            })
            },500)  
          })
        },
      })
    })
  },
  waterDirectionBtn:function(){
    var that = this
    that.setData({
      waterDirect: !that.data.waterDirect
    })
    console.log(that.data.waterDirect)
  },
  camOrientationBtn:function(){
    var that = this
    that.setData({
      camOrientation: !that.data.camOrientation
    })
  },
  adminDisagree:function(){
    wx.getSetting({
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '请允许摄像头功能！',
        })
      }
    })
  },
  modify:function(){
    var that = this
      wx.navigateTo({
        url: "../modify/modify",
      })
  },
  album:function(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function (res) {
        wx.setStorage({
          key: 'selectImg',
          data: res.tempFilePaths,
        })
        console.log(res.tempFilePaths[0])
        wx.navigateTo({
          url: '../album/album',
        })
      },
    })
  },
  takePhoto() {
    var that = this
    const cctx = wx.createCameraContext()
    cctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          camView: !that.data.camView,
          takephoto: false,
          imageUrl: res.tempImagePath,
          disSave: false,
          myTimeDateRemarksAddress:false
        })
        clearInterval(that.data.i)
        clearInterval(that.data.j)
          ctx.clearRect(0, 0, that.data.windowWidth, that.data.windowWidth * 4 / 3)
          ctx.draw()
          ctx.drawImage(res.tempImagePath, 0, 0, that.data.windowWidth, that.data.windowWidth * 4 / 3)
          ctx.draw()
      }
    })
  },
  reTakePhoto:function(){
    var that = this
    that.onLoad()
      // wx.clearStorage()
      // var dateTime = util.formatTime(new Date());
      // var i = setInterval(
      //   function () {
      //     var dateTime = util.formatTime(new Date());
      //     that.setData({
      //       myDate: dateTime.substring(0, 10),
      //       myTime: dateTime.substring(11, 19)
      //     });
      //   }
      //   , 1000)
      that.setData({
        takephoto: true,
        // camView: !that.data.camView,
        // i: i,
        myTimeDateRemarksAddress: false,
        disSave: true,
        waterDirect: true,
        disDirection: false,
        myRemarks: '属于我的时刻 -- 全能相机',
        myAddress: '我在这里',
        // myDate: dateTime.substring(0, 10),
        // myTime: dateTime.substring(11, 19)
      })

  },
  tailoringBtn:function(){
    var that = this
    wx.chooseImage({
      count:1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.setStorage({
          key: 'myImg',
          data: res.tempFilePaths,
        })
        console.log(res.tempFilePaths[0])
        wx.navigateTo({
          url: '../cropper/cropper-example',
        })
      },
    })
  },
  onLoad: function (options) {
    var that = this
    wx.clearStorage()
    var dateTime = util.formatTime(new Date());
    that.setData({
      myDate: dateTime.substring(0, 10),
      myTime: dateTime.substring(11, 19),
      camView:true
    });
    var i = setInterval(
      function () {
        var dateTime = util.formatTime(new Date());
        that.setData({
          myDate: dateTime.substring(0, 10),
          myTime: dateTime.substring(11, 19)
        });
      }
      , 1000)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          i: i
        })
      },
    })
  },
  onShow: function (options) {
    var that = this
    if (wx.getStorageSync('OkImg')){
      that.setData({
        camView:false,
        takephoto:false,
        disSave: false
      })
      wx.getImageInfo({
        src: wx.getStorageSync('OkImg'),
        success:function(res){
          clearInterval(that.data.i)
          clearInterval(that.data.j)
          ctx.clearRect(0, 0, that.data.windowWidth, that.data.windowWidth * 4 / 3)
          ctx.draw()
          if(res.height>res.width){
            ctx.scale(that.data.windowWidth / res.width, that.data.windowWidth / res.width)
            ctx.drawImage(wx.getStorageSync('OkImg'), 0, 0, res.width, res.height)
          }else{
            ctx.translate(that.data.windowWidth, 0)
            ctx.rotate((90 * Math.PI / 180))
            ctx.scale(that.data.windowWidth*4/3 / res.width, that.data.windowWidth / res.height)
            ctx.drawImage(wx.getStorageSync('OkImg'), 0, 0, res.width, res.height )
          }
          ctx.draw(false, function () {
            setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'myCanvas',
                success: function (res) {
                  that.setData({
                    imageUrl: res.tempFilePath
                  })
                },
              })
            }, 500)
          })  
        }
      })
      
    }
    if (that.data.camView) {
      if (wx.getStorageSync('timeValue') && wx.getStorageSync('dateValue')) {
        wx.getStorage({
          key: 'timeValue',
          success: function (res) {
            clearInterval(that.data.i)
            that.setData({
              myTime: res.data
            })
          },
        })
        wx.getStorage({
          key: 'dateValue',
          success: function (res) {
            that.setData({
              myDate: res.data
            })
          },
        })
        wx.getStorage({
          key: 'remarksValue',
          success: function (res) {
            that.setData({
              myRemarks: res.data
            })
          },
        })
        wx.getStorage({
          key: 'addressValue',
          success: function (res) {
            that.setData({
              myAddress: res.data
            })
          },
        })
      } else if (wx.getStorageSync('timeValue') && !wx.getStorageSync('dateValue')) {
        wx.getStorage({
          key: 'timeValue',
          success: function (res) {
            clearInterval(that.data.i)
            that.setData({
              myTime: res.data
            })
          },
        })
        wx.getStorage({
          key: 'remarksValue',
          success: function (res) {
            that.setData({
              myRemarks: res.data
            })
          },
        })
        wx.getStorage({
          key: 'addressValue',
          success: function (res) {
            that.setData({
              myAddress: res.data
            })
          },
        })
      }else if (!wx.getStorageSync('timeValue') && wx.getStorageSync('dateValue')) {
        wx.getStorage({
          key: 'dateValue',
          success: function (res) {
            clearInterval(that.data.i)
            var j = setInterval(
              function () {
                var dateTime = util.formatTime(new Date());
                that.setData({
                  myTime: dateTime.substring(11, 19)
                });
              }
              , 1000)
            that.setData({
              myDate: res.data,
              j: j
            })
          },
        })
        wx.getStorage({
          key: 'remarksValue',
          success: function (res) {
            that.setData({
              myRemarks: res.data
            })
          },
        })
        wx.getStorage({
          key: 'addressValue',
          success: function (res) {
            that.setData({
              myAddress: res.data
            })
          },
        })
      } else {
        wx.getStorage({
          key: 'remarksValue',
          success: function (res) {
            that.setData({
              myRemarks: res.data
            })
          },
        })
        wx.getStorage({
          key: 'addressValue',
          success: function (res) {
            that.setData({
              myAddress: res.data
            })
          },
        })
      }

    } else {
      wx.getStorage({
        key: 'timeValue',
        success: function (res) {
          that.setData({
            myTime: res.data
          })
        },
      })
      wx.getStorage({
        key: 'dateValue',
        success: function (res) {
          that.setData({
            myDate: res.data
          })
        },
      })
      wx.getStorage({
        key: 'remarksValue',
        success: function (res) {
          that.setData({
            myRemarks: res.data
          })
        },
      })
      wx.getStorage({
        key: 'addressValue',
        success: function (res) {
          that.setData({
            myAddress: res.data
          })
        },
      })
    }
  }
})