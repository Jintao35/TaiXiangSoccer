// pages/user/ok.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  agreed() {
    wx.navigateTo({
      url: `./../user/user`
    })
  },
  cancle() {
    wx.navigateBack({
      delta: 1
    })
  }
})