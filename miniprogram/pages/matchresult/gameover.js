const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    lstTab: [
      { title: '出勤统计', count: '0' },
      { title: '比赛结果', count: '' },
      { title: '费用计算', count: '' }
    ],
    minutes: 0,
    lstPlayer: [],      // 出勤队员
    lstAbsencePlayer: [], // 缺勤队员
    lstAbsenceIndex: 0,
    selPlayer: { no: ' ', name: ' ' },
    strscorelist: '',
    strassistlist: '',
    strmvplist: '',
    otherFee: 0,  // 其它费用
    spends: 0,    // 支出
    income: 0,    // 收取
    surplus: 0,   // 盈余
    singleFee: 0, // 每人收取
    match: {
      enemy: '',
      duration: 0,
      goal: 0,
      lose: 0,
      playerlist: [],
      scorelist: [],
      assistlist: [],
      mvplist: [],
      updater: ''
    },
    rules: [
      { name: '_id', rules: { required: false } },
      { name: 'scorelist', rules: { required: false } },
      { name: 'assistlist', rules: { required: false } },
      { name: 'goal', rules: { required: false } },
      { name: 'lose', rules: { required: false } },
      { name: 'updater', rules: { required: false } }
    ]
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

    // 获取首页的playerid
    const pages = getCurrentPages();
    let indexPage = pages[0];
    const updater = indexPage.data.loginPlayer._id;
    const lstActivePlayer = indexPage.data.lstActivePlayer;
    const lstRetirePlayer = indexPage.data.lstRetirePlayer;
    match.updater = updater;
    // 出勤队员列表
    let lstPlayerid = [];
    let lstPlayer = [];
    // 缺勤队员列表
    let lstAbsencePlayer = [];

    // 遍历出勤队员，获取号码、姓名、头像、出场时间
    match.playerlist.forEach(playtime => {
      let player = app.searchByParam(lstActivePlayer, "_id", playtime.playerid);
      if (!player) {
        player = app.searchByParam(lstRetirePlayer, "_id", playtime.playerid);
      }
      player.minutes = playtime.minutes;
      player.positions = playtime.positions;
      if (player._id === 'a0000000000000000000000000000003') {
        // 大门不要钱
        player.freeFlag = true;
      }
      lstPlayer.push(player);
      lstPlayerid.push(player._id);
    });
    // 未出勤人员添加到缺勤队员列表
    for (let index = 0; index < lstActivePlayer.length; index++) {
      const player = lstActivePlayer[index];
      if (lstPlayerid.indexOf(player._id) === -1) {
        lstAbsencePlayer.push(player);
      }
    }

    // 进球队员
    let strscorelist = '';
    for (let count = 6; count > 0; count--) {
      match.scorelist.forEach(score => {
        if (score.count === count) {
          let player = app.searchByParam(lstPlayer, '_id', score.playerid);
          if (count === 1) {
            strscorelist += ' ' + player.no + '.' + player.name;
          } else {
            strscorelist += ' ' + player.no + '.' + player.name + '×' + score.count;
          }
        }
      });
    }
    // 助攻队员
    let strassistlist = '';
    for (let count = 6; count > 0; count--) {
      match.assistlist.forEach(assist => {
        if (assist.count === count) {
          let player = app.searchByParam(lstPlayer, '_id', assist.playerid);
          if (count === 1) {
            strassistlist += ' ' + player.no + '.' + player.name;
          } else {
            strassistlist += ' ' + player.no + '.' + player.name + '×' + assist.count;
          }
        }
      });
    }
    // 本场最佳
    let strmvplist = '';
    match.mvplist.forEach(mvp => {
      let player = app.searchByParam(lstPlayer, '_id', mvp.playerid);
      strmvplist += ' ' + player.no + '.' + player.name;
    });
    this.setData({
      [`lstTab[0].count`]: '' + lstPlayer.length,
      match: match,
      lstPlayer: lstPlayer,
      lstAbsencePlayer: lstAbsencePlayer,
      strscorelist: strscorelist,
      strassistlist: strassistlist,
      strmvplist: strmvplist
    })

    this.calculateAmount();
  },

  // 导航栏切换
  bindSwitchTab: function (e) {
    const tabIndex = e.detail.index;
    this.setData({
      tabIndex: tabIndex
    })
  },

  // 出勤队员列表点击事件
  bindCellClick(e) {
    let player = e.currentTarget.dataset.item;
    this.setData({
      selPlayer: player,
      minutes: player.minutes
    })
  },

  // 缺勤按钮点击事件
  bindDelPlayer(e) {
    let selPlayer = e.currentTarget.dataset.item;
    let lstPlayer = this.data.lstPlayer;
    let playerlist = this.data.match.playerlist;
    for (let index = 0; index < lstPlayer.length; index++) {
      const player = lstPlayer[index];
      if (player._id === selPlayer._id) {
        lstPlayer.splice(index, 1);
        playerlist.splice(index, 1);
      }
    }
    let lstAbsencePlayer = this.data.lstAbsencePlayer;
    lstAbsencePlayer.unshift(selPlayer);

    this.setData({
      [`lstTab[0].count`]: '' + lstPlayer.length,
      [`match.playerlist`]: playerlist,
      selPlayer: { no: ' ', name: ' ', minutes: 0 },
      lstPlayer: lstPlayer,
      lstAbsencePlayer: lstAbsencePlayer,
    })
  },

  // 出场时间滑动选择器选择事件
  bindMinutesChange(e) {
    const minutes = e.detail.value;
    const selPlayer = this.data.selPlayer;
    if (selPlayer._id) {
      const lstPlayer = this.data.lstPlayer;
      for (let index = 0; index < lstPlayer.length; index++) {
        const player = lstPlayer[index];
        if (player._id === selPlayer._id) {
          this.setData({
            ['lstPlayer[' + index + '].minutes']: minutes,
            ['match.playerlist[' + index + '].minutes']: minutes
          })
        }
      }
    }
    this.setData({
      minutes: minutes
    })
  },

  // 缺勤队员列表选择事件
  bindAbsenceChange(e) {
    const lstAbsenceIndex = e.detail.value;
    const lstAbsencePlayer = this.data.lstAbsencePlayer;
    let selPlayer = lstAbsencePlayer[lstAbsenceIndex];
    let minutes = 0;
    if (selPlayer.minutes) {
      minutes = selPlayer.minutes;
    }
    this.setData({
      minutes: minutes,
      lstAbsenceIndex: lstAbsenceIndex,
      selPlayer: selPlayer
    })
  },

  // 缺勤队员出勤事件
  bindAddPlayer() {
    let lstAbsencePlayer = this.data.lstAbsencePlayer;
    if (lstAbsencePlayer.length === 0) {
      return false;
    }
    let lstPlayer = this.data.lstPlayer;
    let playerlist = this.data.match.playerlist;
    const lstAbsenceIndex = this.data.lstAbsenceIndex;
    let minutes = this.data.minutes;
    let player = lstAbsencePlayer[lstAbsenceIndex];
    player.minutes = minutes;
    if (player._id === 'a0000000000000000000000000000003') {
      // 大门不要钱
      player.freeFlag = true;
    }
    lstPlayer.push(player);
    playerlist.push({ playerid: player._id, minutes: minutes, positions: [] })
    lstAbsencePlayer.splice(lstAbsenceIndex, 1);
    this.setData({
      [`lstTab[0].count`]: '' + lstPlayer.length,
      [`match.playerlist`]: playerlist,
      selPlayer: { no: ' ', name: ' ' },
      lstPlayer: lstPlayer,
      lstAbsenceIndex: 0,
      lstAbsencePlayer: lstAbsencePlayer,
    })
  },
  // 进球队员选择事件
  bindScorePlayer: function () {
    let url = `../matchresult/goals?from=scorelist`;
    wx.navigateTo({
      url: url
    })
  },
  // 助攻队员选择事件
  bindAssistPlayer: function () {
    let url = `../matchresult/goals?from=assistlist`;
    wx.navigateTo({
      url: url
    })
  },
  // MVP员选择事件
  bindMvpPlayer: function () {
    let url = `../matchresult/mvp`;
    wx.navigateTo({
      url: url
    })
  },
  // 进球数选择事件
  bindGoalChange: function (e) {
    this.setData({
      [`match.goal`]: e.detail.value
    })
  },
  // 失球数选择事件
  bindLoseChange: function (e) {
    this.setData({
      [`match.lose`]: e.detail.value
    })
  },
  // 最有价值球员失球数选择事件
  bindMvpChange: function (e) {
    let url = `../match/players?from=gameover&max=3`;
    wx.navigateTo({
      url: url
    })
  },
  // 场地费用文本框输入事件
  formFeeInputChange(e) {
    let value = e.detail.value;
    if (!value) {
      value = 0;
    }
    const fee = parseInt(value)
    this.setData({
      [`match.fee`]: fee,
      spends: fee + this.data.otherFee
    })
    this.calculateAmount();
  },
  // 其它费用文本框输入事件
  formOtherFeeInputChange(e) {
    let value = e.detail.value;
    if (!value) {
      value = 0;
    }
    const otherFee = parseInt(value);
    this.setData({
      otherFee: otherFee,
      spends: this.data.match.fee + otherFee
    })
    this.calculateAmount();
  },
  formSingleFeeInputChange(e) {
    const singleFee = parseInt(e.detail.value)
    this.setData({
      singleFee: singleFee,
    })
  },
  // 队员收取场地费
  bindPlayerCharge(e) {
    let selPlayer = e.currentTarget.dataset.item;
    let lstPlayer = this.data.lstPlayer;
    for (let index = 0; index < lstPlayer.length; index++) {
      const player = lstPlayer[index];
      if (player._id === selPlayer._id) {
        player.freeFlag = false;
      }
    }
    this.setData({
      lstPlayer: lstPlayer
    })
    this.calculateAmount();
  },
  // 队员免收场地费
  bindFreePlayer(e) {
    let selPlayer = e.currentTarget.dataset.item;
    let lstPlayer = this.data.lstPlayer;
    for (let index = 0; index < lstPlayer.length; index++) {
      const player = lstPlayer[index];
      if (player._id === selPlayer._id) {
        player.freeFlag = true;
      }
    }
    this.setData({
      lstPlayer: lstPlayer
    })
    this.calculateAmount();
  },
  // 计算盈余
  calculateAmount() {
    // 计算收费人数
    const lstPlayer = this.data.lstPlayer;
    let count = 0;
    lstPlayer.forEach(player => {
      if (!player.freeFlag) {
        count++;
      }
    });
    // 总支出 = 场地费用 + 其它费用
    const spends = this.data.match.fee + this.data.otherFee;
    // 每人最低应收 = 总支出 / 收费人数，有余数时+1
    const singleFee = parseInt(spends / count) + (spends % count === 0 ? 0 : 1);
    // 总收取 = 每人最低应收 * 收费人数
    const income = singleFee * count;
    // 盈余 = 总收取 - 总支出
    const surplus = income - spends;
    this.setData({
      spends: spends,
      income: income,
      surplus: surplus,
      singleFee: singleFee
    })
  },
  // 每人收费减少
  bindSub: function () {
    var singleFee = this.data.singleFee;
    if (singleFee < 1) {
      return false;
    }
    singleFee--;
    this.setData({
      singleFee: singleFee
    })
    this.calculateSurplusBySingleFee();
  },
  // 每人收费增加
  bindAdd: function () {
    var singleFee = this.data.singleFee;
    if (singleFee >= 999) {
      return false;
    }
    singleFee++;
    this.setData({
      singleFee: singleFee
    })
    this.calculateSurplusBySingleFee();
  },
  // 计算盈余
  calculateSurplusBySingleFee() {
    // 计算收费人数
    const lstPlayer = this.data.lstPlayer;
    let count = 0;
    lstPlayer.forEach(player => {
      if (!player.freeFlag) {
        count++;
      }
    });
    // 总收取 = 每人应收 * 收费人数
    const income = this.data.singleFee * count;
    // 盈余 = 总收取 - 总支出
    const surplus = income - this.data.spends;
    this.setData({
      income: income,
      surplus: surplus
    })
  },
  // 保存
  submitForm() {
    wx.showLoading({
      title: '',
      mask: true
    })
    const match = this.data.match;
    if (match.status === 0) {
      match.status = 1;
    }
    let model = {
      _id: match._id,
      playerlist: match.playerlist,
      scorelist: match.scorelist,
      assistlist: match.assistlist,
      mvplist: match.mvplist,
      status: match.status,
      goal: match.goal,
      lose: match.lose,
      updater: match.updater
    }
    // 更新比赛结果
    wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'match',
        action: 'updateResult',
        data: model
      }
    }).then(res => {
      // 正确的执行结果
      console.log('更新比赛结果成功', res);
      // 获取上一个页面
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      // 更新比赛信息页面的列表数据
      const match = this.data.match;
      const lstPrevMatch = prevPage.data.lstMatch;
      for (let index = 0; index < lstPrevMatch.length; index++) {
        const prevMatch = lstPrevMatch[index];
        if (prevMatch._id === match._id) {
          prevPage.setData({
            [`lstMatch[` + index + `]`]: match
          })
          prevPage.formatListMatch();
          break;
        }
      }
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      })
    }).catch(err => {
      // 错误的执行结果
      console.log('更新比赛结果失败', err);
      wx.hideLoading();
    })
  }
})