const app = getApp();
Page({
  data: {
    selCount: 0,
    lstPlayer: []
  },
  // 页面加载事件
  onLoad: function (options) {
    // 获取上两个页面（首页）
    let pages = getCurrentPages();
    let indexPage = pages[0];
    // 获取上一个页面（发布比赛页面）
    let prevPage = pages[pages.length - 2];
    // 上一个页面的已选球员列表
    let lstSelPlayer = prevPage.data.match.playerlist;
    let selCount = lstSelPlayer.length;
    // 获取首页的现役球员列表
    const lstActivePlayer = JSON.parse(JSON.stringify(indexPage.data.lstActivePlayer));
    // 本页的可选队员列表
    let lstPlayer = [];
    lstActivePlayer.forEach(player => {
      if (app.containsKey(lstSelPlayer, "playerid", player._id)) {
        player.checked = true;
      } else {
        player.checked = false;
      }
      lstPlayer.push(player);
    });
    if (selCount > 0) {
      // 获取首页的退役球员列表
      const lstRetirePlayer = JSON.parse(JSON.stringify(indexPage.data.lstRetirePlayer));
      // 看看已选队员中有无已退役队员
      lstSelPlayer.forEach(selPlayer => {
        // 已选队员中有人退役，把退役球员加入选择列表中
        let retirePlayer = app.searchByParam(lstRetirePlayer, "_id", selPlayer.playerid);
        if (retirePlayer) {
          retirePlayer.checked = true;
          lstPlayer.push(retirePlayer);
        }
      });
    }
    this.setData({
      selCount: selCount,
      lstPlayer: lstPlayer
    })
  },

  // 队员选择事件
  bindPlayerChange: function (e) {
    let selCount = 0;
    let lstPlayer = this.data.lstPlayer;
    for (let i = 0, len = lstPlayer.length; i < len; ++i) {
      if (e.detail.value.indexOf(lstPlayer[i]._id) > -1) {
        lstPlayer[i].checked = true;
        selCount += 1;
      } else {
        delete lstPlayer[i].checked
      }
    }
    this.setData({
      selCount: selCount,
      lstPlayer: lstPlayer
    })
  },

  // 全清按钮事件
  bindClear() {
    let lstPlayer = this.data.lstPlayer;
    for (let i = 0, len = lstPlayer.length; i < len; ++i) {
      delete lstPlayer[i].checked
    }
    this.setData({
      selCount: 0,
      lstPlayer: lstPlayer
    })
  },

  // 保存按钮事件
  bindSave() {
    // 获取上一个页面（发布比赛页面）
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let lstPlayer = [];
    this.data.lstPlayer.forEach(player => {
      if (player.checked) {
        lstPlayer.push({ playerid: player._id, minutes: 0, positions: [] });
      }
    });
    // 调用父页面的setData()方法
    prevPage.setData({
      [`match.playerlist`]: lstPlayer
    })
    wx.navigateBack({
      delta: 1
    })
  }
});