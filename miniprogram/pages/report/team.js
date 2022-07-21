const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lstYyyyMm: [],
    startIndex: [0, 0],
    endIndex: [0, 0],
    enemy: "",
    reportFlag: true,
    teamReport: {},
    lstMatch: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    const date = new Date();
    const lstMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const lstYear = [];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    for (let i = date.getFullYear(); i >= 2021; i--) {
      lstYear.push(i);
    }
    let lstYyyyMm = [lstYear, lstMonth];
    let startIndex = [lstYear.indexOf(year - 1), lstMonth.indexOf(month)];
    let endIndex = [lstYear.indexOf(year), lstMonth.indexOf(month)];
    this.setData({
      lstYyyyMm: lstYyyyMm,
      startIndex: startIndex,
      endIndex: endIndex
    })
    this.resetTeamReport();
  },

  // 文本框输入事件
  formInputChange: function (e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`${field}`]: e.detail.value
    })
  },
  // 多列选择确定事件
  bindYmPickerChange: function (e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`${field}`]: e.detail.value
    })
  },
  // 多列选择列事件
  bindYmPickerColumnChange: function (e) {
    const data = {
      field: e.currentTarget.dataset.field,
      column: e.detail.column
    }
    this.setData({
      [`${data.field}[${data.column}]`]: e.detail.value,
    })
  },
  // 详情按钮点击事件
  bindMatchResultView: function (e) {
    const matchid = e.currentTarget.dataset.matchid;
    console.log(e, matchid)
    // 技术统计，跳转到技术统计页面
    const url = `../matchresult/view?matchid=` + matchid;
    wx.navigateTo({
      url: url
    })
  },

  // 格式化数据
  formatTeamReport() {
    let teamReport = this.data.teamReport;
    if (teamReport.match > 0) {
      // 净胜球
      teamReport.difference = teamReport.goal - teamReport.lose;
      // 胜率
      teamReport.shenglv = (teamReport.win / teamReport.match * 100).toFixed(2);
      // 场均进球
      if (teamReport.goal > 0) {
        teamReport.goalAvg = (teamReport.goal / teamReport.match).toFixed(2);
      } else {
        teamReport.goalAvg = 0;
      }
      // 场均失球
      if (teamReport.lose > 0) {
        teamReport.loseAvg = (teamReport.lose / teamReport.match).toFixed(2);
      } else {
        teamReport.loseAvg = 0;
      }
      this.setData({
        teamReport: teamReport
      })
    }
  },

  // 获取球队战绩
  getTeamReportByMonth: async function () {
    wx.showLoading({
      title: '',
      mask: true
    })
    const lstYyyyMm = this.data.lstYyyyMm;
    const startIndex = this.data.startIndex;
    const endIndex = this.data.endIndex;
    const startMonth = lstYyyyMm[0][startIndex[0]] * 100 + lstYyyyMm[1][startIndex[1]];
    const endMonth = lstYyyyMm[0][endIndex[0]] * 100 + lstYyyyMm[1][endIndex[1]];
    const searchParam = {
      startMonth: startMonth,
      endMonth: endMonth
    }
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'team',
        action: 'groupByMonthRange',
        data: searchParam
      }
    }).then(res => {
      // 正确的执行结果
      console.log('获取球队战绩成功', res);
      if (res.result.data.list.length > 0) {
        this.setData({
          teamReport: res.result.data.list[0]
        })
        this.formatTeamReport();
      } else {
        this.resetTeamReport();
      }
      wx.hideLoading();
    }).catch(err => {
      // 错误的执行结果
      console.log('获取球队战绩失败', err);
      wx.hideLoading();
    })
  },

  // 获取对手比赛列表
  getMatchListByMonth: async function (enemy) {
    wx.showLoading({
      title: '',
      mask: true
    })
    const lstYyyyMm = this.data.lstYyyyMm;
    const startIndex = this.data.startIndex;
    let yyyy = lstYyyyMm[0][startIndex[0]];
    let mm = startIndex[1];
    const startDate = new Date(yyyy, mm, 1);
    const endIndex = this.data.endIndex;
    yyyy = lstYyyyMm[0][endIndex[0]]
    mm = endIndex[1] + 1;
    const endDate = new Date(yyyy, mm, 1);
    const searchParam = {
      enemy: enemy,
      startDate: startDate,
      endDate: endDate,
      pageIndex: 1,
      pageSize: 99
    }
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'match',
        action: 'listByEnemyAndDateRange',
        data: searchParam
      }
    }).then(res => {
      console.log('获取比赛列表成功', res)
      this.setData({
        lstMatch: res.result.data
      })
      this.formatListMatch();
      wx.hideLoading();
    }).catch(err => {
      console.log('获取比赛列表失败', err)
      wx.hideLoading();
    })
  },

  // 重置统计数据
  resetTeamReport() {
    this.setData({
      teamReport: {
        match: 0,
        win: 0,
        draw: 0,
        lost: 0,
        shenglv: (0).toFixed(2),
        goal: 0,
        lose: 0,
        difference: 0,
        goalAvg: (0).toFixed(2),
        loseAvg: (0).toFixed(2),
        join: 0,
        leave: 0
      }
    })
  },

  // 格式化列表数据
  formatListMatch() {
    this.resetTeamReport();
    let lstMatch = this.data.lstMatch;
    if (lstMatch.length === 0) {
      return false;
    }
    let teamReport = this.data.teamReport;
    lstMatch.forEach(match => {
      // 格式化列表中的日期
      match.strTime = app.formatDate(match.time, 'yyyy年MM月dd日');
      teamReport.match += 1;
      if (match.goal > match.lose) {
        teamReport.win = teamReport.win + 1;
      } else if (match.goal < match.lose) {
        teamReport.lost = teamReport.lost + 1;
      } else {
        teamReport.draw = teamReport.draw + 1;
      }
      teamReport.goal = teamReport.goal + match.goal;
      teamReport.lose = teamReport.lose + match.lose;
    });
    this.setData({
      lstMatch: lstMatch
    })
    this.formatTeamReport();
  },

  submitForm() {
    const enemy = this.data.enemy;
    let reportFlag = true;
    if (enemy.length > 0) {
      reportFlag = false;
      this.getMatchListByMonth(enemy);
    } else {
      this.getTeamReportByMonth();
    }
    this.setData({
      reportFlag: reportFlag
    })
  }
})