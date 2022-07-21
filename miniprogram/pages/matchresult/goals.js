const app = getApp();

Page({
  data: {
    strTitle: '',
    from: '',
    sum: 0,
    lstPlayer: []
  },
  // 页面加载事件
  onLoad: function (options) {
    const pages = getCurrentPages();
    // 获取上一个页面的比赛信息（比赛管理员评分页面matchresult/gameover）
    const prevPage = pages[pages.length - 2];
    const match = prevPage.data.match;
    const from = options.from;
    let strTitle = '进球';
    if (from === 'assistlist') {
      strTitle = '助攻';
    }
    let sum = 0;
    // 将比赛初始队员+已报名队员-请假队员添加到候选队员列表
    let lstPlayer = [];
    // 获取首页的现役队员列表（首页index/index）
    const indexPage = pages[0];
    const lstActivePlayer = indexPage.data.lstActivePlayer;
    const lstRetirePlayer = indexPage.data.lstRetirePlayer;
    // 获取该场比赛全部队员
    match.playerlist.forEach(playtime => {
      let player = app.searchByParam(lstActivePlayer, "_id", playtime.playerid);
      if (!player) {
        player = app.searchByParam(lstRetirePlayer, '_id', playtime.playerid);
      }
      player.count = 0;
      lstPlayer.push(player);
    });
    // 获取进球/助攻数
    if (match[from]) {
      for (let index = 0; index < lstPlayer.length; index++) {
        let player = lstPlayer[index];
        let fromCount = app.searchByParam(match[from], 'playerid', player._id);
        if (fromCount) {
          player.count = fromCount.count;
          sum += fromCount.count;
        }
      }
    }
    this.setData({
      strTitle: strTitle,
      from: from,
      sum: sum,
      lstPlayer: lstPlayer
    })
  },

  // 数量选择事件
  bindCountChange(e) {
    const playerid = e.currentTarget.dataset.playerid;
    let sum = this.data.sum;
    let lstPlayer = this.data.lstPlayer;
    let newCount = e.detail.value;
    for (let index = 0; index < lstPlayer.length; index++) {
      if (lstPlayer[index]._id === playerid) {
        const oldCount = lstPlayer[index].count;
        lstPlayer[index].count = newCount;
        sum = sum - oldCount + newCount;
        this.setData({
          sum: sum,
          [`lstPlayer[` + index + `]`]: lstPlayer[index]
        })
      }
    }
  },

  // 全清按钮事件
  bindClear() {
    let lstPlayer = this.data.lstPlayer;
    for (let i = 0, len = lstPlayer.length; i < len; ++i) {
      lstPlayer[i].count = 0;
    }
    this.setData({
      sum: 0,
      lstPlayer: lstPlayer
    })
  },

  // 保存按钮事件
  bindSave() {
    // 获取上一个页面（6_1记录结果matchresult/gameover）
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    const lstPlayer = this.data.lstPlayer;
    const sum = this.data.sum;
    let lstCount = [];
    let str = '';
    for (let count = 6; count > 0; count--) {
      lstPlayer.forEach(player => {
        if (player.count === count) {
          if (count === 1) {
            str += ' ' + player.no + '.' + player.name;
            lstCount.push({ playerid: player._id, count: player.count });
          } else {
            str += ' ' + player.no + '.' + player.name + '×' + player.count;
            lstCount.push({ playerid: player._id, count: player.count });
          }
        }
      });
    }
    // 调用父页面的setData()方法
    if (!prevPage.data.match.goal || prevPage.data.match.goal < sum) {
      prevPage.setData({
        [`match.goal`]: sum
      })
    }
    prevPage.setData({
      [`str` + this.data.from]: str,
      [`match.` + this.data.from]: lstCount
    })
    wx.navigateBack({
      delta: 1
    })
  }
});