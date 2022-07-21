const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    lstPlayer: []
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: async function (options) {
    // 获取比赛信息
    wx.showLoading({
      title: '',
      mask: true
    })
    let match = {};
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'match',
        action: 'get',
        data: {
          matchid: options.matchid
        }
      }
    }).then(res => {
      console.log('获取比赛信息成功', res);
      match = res.result.data;
      wx.hideLoading();
    }).catch(err => {
      console.log('获取比赛信息失败', err);
      wx.hideLoading();
    })

    const pages = getCurrentPages();
    let indexPage = pages[0];
    const lstActivePlayer = indexPage.data.lstActivePlayer;
    const lstRetirePlayer = indexPage.data.lstRetirePlayer;

    // 出勤队员列表
    let lstPlayerid = [];
    let lstPlayer = [];

    // 遍历出勤队员，获取号码、姓名、头像、出场时间
    match.playerlist.forEach(playtime => {
      let player = app.searchByParam(lstActivePlayer, "_id", playtime.playerid);
      if (!player) {
        player = app.searchByParam(lstRetirePlayer, "_id", playtime.playerid);
      }
      player.positions = playtime.positions;
      lstPlayer.push(player);
      lstPlayerid.push(player._id);
    });
    lstPlayer.forEach(player => {
      // 进球队员
      const score = app.searchByParam(match.scorelist, 'playerid', player._id);
      if (score) {
        player.goal = score.count;
      } else {
        player.goal = '-';
      }
      // 助攻队员
      const assist = app.searchByParam(match.assistlist, 'playerid', player._id);
      if (assist) {
        player.assist = assist.count;
      } else {
        player.assist = '-';
      }
      // 本场最佳
      const mvp = app.searchByParam(match.mvplist, 'playerid', player._id);
      if (mvp) {
        player.isMvp = true;
      } else {
        player.isMvp = '-';
      }
    });
    const strTime = app.formatDate(match.time, 'yyyy年MM月dd日');
    const title = strTime + ' 太翔 ' + match.goal + ' : ' + match.lose + ' ' + match.enemy;
    this.setData({
      title: title,
      lstPlayer: lstPlayer
    })
  }
})