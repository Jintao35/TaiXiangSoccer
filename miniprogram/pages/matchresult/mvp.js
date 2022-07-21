const app = getApp();
Page({
  data: {
    max: 3,
    players: 0,
    lstPlayer: []
  },
  // 页面加载事件
  onLoad: function (options) {
    const pages = getCurrentPages();
    // 获取上一个页面的比赛信息（比赛管理员评分页面matchresult/gameover）
    const prevPage = pages[pages.length - 2];
    const match = prevPage.data.match;
    let players = 0;
    // 候选队员列表
    let lstPlayer = [];
    // 获取首页的现役队员列表（首页index/index）
    const indexPage = pages[0];
    const lstActivePlayer = indexPage.data.lstActivePlayer;
    const lstRetirePlayer = indexPage.data.lstRetirePlayer;
    // 获取该场比赛全部队员
    match.playerlist.forEach(matchPlayer => {
      let player = app.searchByParam(lstActivePlayer, "_id", matchPlayer.playerid);
      if (!player) {
        player = app.searchByParam(lstRetirePlayer, '_id', matchPlayer.playerid);
      }
      // 获取mvp
      if (match.mvplist) {
        let mvpPlayer = app.searchByParam(match.mvplist, "playerid", player._id);
        if (mvpPlayer) {
          player.checked = true;
        }
      }
      lstPlayer.push(player);
    });
    this.setData({
      players: players,
      lstPlayer: lstPlayer
    })
  },

  // 队员选择事件
  bindPlayerChange: function (e) {
    let players = 0;
    let lstPlayer = this.data.lstPlayer;
    for (let i = 0, len = lstPlayer.length; i < len; ++i) {
      if (e.detail.value.indexOf(lstPlayer[i]._id) > -1) {
        lstPlayer[i].checked = true;
        players += 1;
      } else {
        delete lstPlayer[i].checked
      }
    }
    this.setData({
      players: players,
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
      players: 0,
      lstPlayer: lstPlayer
    })
  },

  // 保存按钮事件
  bindSave() {
    if (this.data.players > this.data.max) {
      return false;
    }
    // 获取上一个页面（6_1记录结果matchresult/gameover）
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    let lstMvp = [];
    let str = '';
    this.data.lstPlayer.forEach(player => {
      if (player.checked) {
        lstMvp.push({ playerid: player._id, count: 1 });
        str += ' ' + player.no + '.' + player.name;
      }
    });
    // 调用父页面的setData()方法
    prevPage.setData({
      strmvplist: str,
      [`match.mvplist`]: lstMvp
    })
    wx.navigateBack({
      delta: 1
    })
  }
});