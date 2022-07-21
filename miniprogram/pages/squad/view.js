const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    lstTab: [
      { title: '第1节', count: '' },
      { title: '第2节', count: '' },
      { title: '第3节', count: '' },
      { title: '第4节', count: '' }
    ],
    lstAllPlayer: [],
    lstMatchPlayer: [],
    lstPlayer: [],
    match: {
      _id: "",
      quarterlist: [],
      playtimelist: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    // 获取首页的现役队员列表
    let indexPage = pages[0];
    const lstAllPlayer = indexPage.data.lstAllPlayer;
    // 获取比赛信息页面的比赛信息数据
    let prevPage = pages[pages.length - 2];
    const match = prevPage.data.match;
    // 将比赛队员添加到候选队员列表
    let lstMatchPlayer = [];
    // 获取该场比赛全部队员
    match.playerlist.forEach(playtime => {
      let player = app.searchByParam(lstAllPlayer, "_id", playtime.playerid);
      player.checked = false;
      lstMatchPlayer.push(player);
    });
    this.setData({
      match: match,
      lstAllPlayer: lstAllPlayer,
      lstMatchPlayer: lstMatchPlayer
    })
  },
  // 导航栏切换
  bindSwitchTab: function (e) {
    // 设置tab下标
    const tabIndex = e.detail.index;
    // 初始化候选队员列表
    this.initListPlayer(tabIndex);
    this.setData({
      tabIndex: tabIndex
    })
  },
  // 初始化候选队员列表
  initListPlayer(tabIndex) {
    const squad = this.data.match.quarterlist[tabIndex];
    let lstPlayer = JSON.parse(JSON.stringify(this.data.lstMatchPlayer));
    for (let index = lstPlayer.length - 1; index >= 0; index--) {
      lstPlayer[index].checked = false;
      if (squad.lineuplist.length > 0) {
        if (app.containsKey(squad.lineuplist, 'playerid', lstPlayer[index]._id)) {
          lstPlayer.splice(index, 1);
        }
      }
    }
    this.setData({
      lstPlayer: lstPlayer
    })
  },
})