const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lstYear: [],
    yearIndex: 0,
    tabIndex: 0,
    lstMatch: [],
    detail: {
      playerid: '',
      playername: '',
      games: 0,
      goal: 0,
      assist: 0,
      mvp: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // const date = new Date();
    // const lstYear = [];
    // let year = date.getFullYear();
    // for (let i = date.getFullYear(); i >= 2021; i--) {
    //   lstYear.push(i);
    // }
    // this.setData({
    //   lstYear: lstYear
    // })
    // await this.getStudentReportByYear(year);
    // this.formatStudentReport();
    wx.showLoading({
      title: '',
      mask: true
    })
    const date = new Date();
    const lstYear = [];
    let year = date.getFullYear();
    for (let i = date.getFullYear(); i >= 2021; i--) {
      lstYear.push(i);
    }
    this.setData({
      lstYear: lstYear,
      playerid: options.playerid
    })
    await this.getListMatchByYear(year);
    this.formatListMatch();
    wx.hideLoading();
  },
  // 选择年份事件
  bindPickerChange: async function (e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`${field}`]: e.detail.value
    })
    await this.getListMatchByYear(this.data.lstYear[e.detail.value]);
    this.formatListMatch();
  },

  // 提示框按钮点击事件
  tapDialogButton(e) {
    if (e.detail.index == 0) {
      this.setData({
        dialogShow: false
      })
    } else {
      this.chendian();
    }
  },

  // 获取比赛列表
  getListMatchByYear: async function (year) {
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'match',
        action: 'listByYear',
        data: {
          startDate: year + '-01-01',
          endDate: year + 1 + '-01-01',
          pageIndex: 1,
          pageSize: 99
        }
      }
    }).then(res => {
      console.log('获取比赛列表成功', res)
      this.setData({
        lstMatch: res.result.data
      })
    }).catch(err => {
      console.log('获取比赛列表失败', err)
      wx.hideLoading();
    })
  },

  // 格式化列表数据
  formatListMatch() {
    const lstAllMatch = this.data.lstMatch;
    let lstMatch = [];
    let detail = this.data.detail;
    for (let index = 0; index < lstAllMatch.length; index++) {
      let match = lstAllMatch[index];
      // 队员出勤 false不统计，true统计
      if (match.workflag === false || match.status !== 2) {
        continue;
      }
      let matchPlayer = app.searchByParam(match.playerlist, "playerid", this.data.playerid);
      // 队员是本次比赛对员
      if (!matchPlayer) {
        continue;
      }
      // 格式化列表中的日期
      match.strTime = app.formatDate(match.time, 'MM月dd日 ddd HH:mm')
      // 队员出场次数+1
      detail.games = detail.games + 1;
      // 累计进球、助攻、mvp
      const playerScore = app.searchByParam(match.scorelist, "playerid", matchPlayer.playerid);
      if (playerScore) {
        match.pgoal = playerScore.count;
        detail.goal = detail.goal + playerScore.count;
      }
      const playerAssist = app.searchByParam(match.assistlist, "playerid", matchPlayer.playerid);
      if (playerAssist) {
        match.passist = playerAssist.count;
        detail.assist = detail.assist + playerAssist.count;
      }
      const playerMvp = app.searchByParam(match.mvplist, "playerid", matchPlayer.playerid);
      if (playerMvp) {
        match.pmvp = true;
        detail.mvp = detail.mvp + 1;
      }
      lstMatch.push(match);
    }
    this.setData({
      lstMatch: lstMatch,
      detail: detail
    })
  }
})