//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res
        this.globalData.windowHeight = res.windowHeight / (res.windowWidth / 750)
        this.globalData.screenHeight = res.screenHeight / (res.screenWidth / 750)
      }
    })
  },
  globalData: {
    systemInfo: null,
    windowHeight: null, // rpx换算px后的窗口高度
    screenHeight: null, // rpx换算px后的屏幕高度
  }
})