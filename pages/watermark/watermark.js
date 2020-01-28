const app = getApp()

let exif = require('../../utils/exif/exif.js')
Page({
  data: {
    seleceIMG:'请选择照片',
    able:true,
    focu:false,
    imgSrc:'',
    myDate:'',
    myTime:'',
    imgW: '',
    imgH: '', 
    byclear:1,
    yclear:1,
    saveFirst:'',
    saveTwo:'',
    saveTo:true,
    inputValue:'',
    iptValue:'',
    iptValueRemark:'',
    iptValueAddress:'',
    x : 0,
    y : 0,
    windowHeight: 0,
    screenHeight: 0
  },

  selectPhoto:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '请选择设备相机直接拍摄的照片，否则生成水印失败！',
      showCancel:false,
      success(res) {
        wx.chooseImage({
          count: 1,
          sizeType: ['original'],
          sourceType: ['album'],
          success: function (res) {
            const tempFilePaths = res.tempFilePaths
            that.setData({
              imgSrc: tempFilePaths
            })
            wx.getImageInfo({
              src: res.tempFilePaths[0],
              success(res) {
                const imgMsg = res
                wx.getFileSystemManager().readFile({
                  filePath: res.path,
                  success: res => {
                    exif.getData(res.data, img => console.log('img:', img))
                    // const strPretty = exif.pretty(res.data)
                    const dateTime = res.data.exifdata.DateTime
                    if (dateTime){
                      const datas = dateTime.substring(0, 4) + '.' + dateTime.substring(5, 7) + '.' + dateTime.substring(8, 10)
                      that.setData({
                        myDate:datas
                      })
                      that.setData({
                        myTime: dateTime.substring(11, 19)
                      })
                      let whsrc = imgMsg.height / imgMsg.width
                      let byclear = that.data.byclear
                      let yclear = that.data.yclear
                      const ctx = wx.createCanvasContext('canvasIn');
                      if (imgMsg.width > 375 * byclear)
                      ctx.scale(375 * byclear / imgMsg.width, 375 * byclear / imgMsg.width);
                      ctx.drawImage(imgMsg.path, 0, 0, imgMsg.width, imgMsg.height)
                      ctx.drawImage('/images/按钮.png', imgMsg.width *1.5/ 20, imgMsg.height - 2.5 * (imgMsg.width * 1 / 7), imgMsg.width * 3 / 7, imgMsg.width * 1 / 7)
                      ctx.setFontSize((70 / 1440) * imgMsg.width)
                      ctx.fillText(that.data.myDate, imgMsg.width * 3.35 / 20, imgMsg.height - 2.15 * (imgMsg.width * 1 / 7))
                      ctx.setFontSize((130 / 1440) * imgMsg.width)
                      ctx.fillText(that.data.myTime, imgMsg.width * 2.25 / 20, imgMsg.height - 1.6 * (imgMsg.width * 1 / 7))
                      ctx.draw(false, function () {
                        that.setData({
                          saveTo: false
                        })
                        setTimeout(function () {
                          wx.canvasToTempFilePath({
                            canvasId: 'canvasIn',
                            success: function (res) {
                              that.setData({
                                saveFirst: res.tempFilePath,
                              })
                            },
                          })
                          wx.hideLoading()
                        }, 1000)
                      })
                      that.setData({
                        imgW: imgMsg.width > 375 ? 750 : imgMsg.width * 2 / byclear,
                        imgH: imgMsg.width > 375 ? 750 * whsrc : imgMsg.height * 2 / byclear
                      })
                      that.setData({
                        seleceIMG: '重新选择照片'
                      })
                    }else{
                      wx.showModal({
                        title: '提示',
                        content: '由于您未选择设备相机直接拍摄的照片，请重新选择'
                      })
                    }
                  },
                })
              }
            })
          },
        })
      }
    })
  },

  saveTo:function(){
    var that = this
    if (that.data.saveTwo){
      wx.showLoading({
        title: '保存相册中',
      })
      setTimeout(function () {
        wx.saveImageToPhotosAlbum({
          filePath: that.data.saveTwo,
        })
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
        })
      }, 2500)
    }else{
      wx.showModal({
        title: '提示',
        content: '备注和地址不能为空！'
      })
      that.setData({
        iptValue: '',
        iptValueRemark: '',
        iptValueAddress: ''
      })
    }
  },

  inputValueRemark:function(e){
    var that = this
    that.setData({
      inputValueRemark:e.detail.value
    })
    if (that.data.inputValueAddress){
      that.setData({
        able:false
      })
    }
  },
  
  inputValueAddress: function (e) {
    var that = this
    that.setData({
      inputValueAddress: e.detail.value
    })
    if (that.data.inputValueRemark) {
      that.setData({
        able: false
      })
    }
  },

  nextFocus:function(){
    var that = this
    that.setData({
      focu: true
    })
  },

  addToremarks(){
    var that = this 
      that.setData({
        iptValue: ''
      })
      wx.getImageInfo({
        src: that.data.saveFirst,
        success: function (res) {
          wx.setStorage({
            key: 'x',
            data: res.width,
          })
          wx.setStorage({
            key: 'y',
            data: res.height,
          })
        },
      })
      let whsrc = wx.getStorageSync('y') / wx.getStorageSync('x')
      let byclear = that.data.byclear
      const ctx = wx.createCanvasContext('canvasIn');
      if (wx.getStorageSync('x') > 375 * byclear) 
      ctx.scale(375 * byclear / wx.getStorageSync('x'), 375 * byclear / wx.getStorageSync('x'));
      ctx.drawImage(that.data.saveFirst, 0, 0, wx.getStorageSync('x'), wx.getStorageSync('y'))
      if (that.data.inputValueRemark && that.data.inputValueAddress) {
          ctx.setFillStyle('white')
          ctx.setFontSize((70 / 1440) * wx.getStorageSync('x'))
          ctx.setShadow(0, 0, 3, 'black')
          ctx.fillText('“ ' + that.data.inputValueRemark + ' ”', wx.getStorageSync('x') * 1.5 / 20, wx.getStorageSync('y') - (wx.getStorageSync('x') * 1 / 7))
          ctx.setShadow(0, 0, 3, 'black')
          ctx.drawImage('/images/坐标.png', wx.getStorageSync('x') * 1.5 / 20, wx.getStorageSync('y') - 0.8 * (wx.getStorageSync('x') * 1 / 7), wx.getStorageSync('x') / 20, wx.getStorageSync('x') / 20)
          ctx.setFillStyle('white')
          ctx.setFontSize((70 / 1440) * wx.getStorageSync('x'))
          ctx.setShadow(0, 0, 3, 'black')
          ctx.fillText(that.data.inputValueAddress, wx.getStorageSync('x') * 3 / 20, wx.getStorageSync('y') - 0.5 * (wx.getStorageSync('x') * 1 / 7))
        ctx.draw(false, function () {
          that.setData({
            saveTo: false
          })
          setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: 'canvasIn',
              success: function (res) {
                that.setData({
                  saveTwo: res.tempFilePath,
                })
              },
            })
            wx.hideLoading()
          }, 1000)
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '备注和地址不能为空！'
        })
        that.setData({
          inputValueRemark:'',
          inputValueAddress:''
        })
      }  
  },

  directTo:function(){
    wx.navigateTo({
      url: '../address/address',
    })
  },

  onReady() {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        let byclear = res.screenWidth / 375
        let yclear = res.screenHeight / 375
        that.setData({
          byclear : byclear,
          yclear : yclear
        })
      },
    })
  },

  onLoad: function () {
    var that = this
    that.setData({
      windowHeight: app.globalData.windowHeight,
      screenHeight: app.globalData.screenHeight
    })
  }
})