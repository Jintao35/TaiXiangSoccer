const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lstPlaytime: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    // 获取首页的现役队员列表
    let indexPage = pages[0];
    const lstAllPlayer = indexPage.data.lstAllPlayer;
    // 获上一个页面的比赛时长列表
    let prevPage = pages[pages.length - 2];
    let lstPlaytime = prevPage.data.match.playtimelist;
    lstPlaytime.forEach(playtime => {
      const player = app.searchByParam(lstAllPlayer, '_id', playtime.playerid);
      if (player) {
        playtime.pic = player.pic;
        playtime.no = player.no;
        playtime.name = player.name;
      } else {
        playtime.pic = app.emptyPic;
        playtime.no = '';
        playtime.name = '退役队员';
      }
    });
    this.setData({
      lstPlaytime: lstPlaytime
    })
  },

  // 确定按钮
  bindReturn() {
    // 返回上一个页面
    wx.navigateBack({
      delta: 1
    })
  }
})
