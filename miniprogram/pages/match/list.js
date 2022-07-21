const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lstYear: [],
    yearIndex: 0,
    loginPlayer: {},
    dialogShow: false,
    buttons: [{ text: '取消' }, { text: '确定' }],
    showActionsheet: false,
    actionSheetTitle: '',
    groups: [],
    lstMatch: [],
    searchParam: {},
    match: {},
    lstPlayer: [],
    teamReport: {
      month: 0,
      match: 0,
      win: 0,
      draw: 0,
      lost: 0,
      goal: 0,
      lose: 0,
      join: 0,
      leave: 0
    },
    lstStudentReport: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '',
      mask: true
    })
    // 获取首页的用户登录信息
    let pages = getCurrentPages();
    let indexPage = pages[0];
    const loginPlayer = indexPage.data.loginPlayer;
    const date = new Date();
    const lstYear = [];
    let year = date.getFullYear();
    for (let i = date.getFullYear(); i >= 2021; i--) {
      lstYear.push(i);
    }
    this.setData({
      lstYear: lstYear,
      loginPlayer: loginPlayer
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
      this.formatListMatch();
    }).catch(err => {
      console.log('获取比赛列表失败', err)
      wx.hideLoading();
    })
  },

  // 格式化列表数据
  formatListMatch() {
    let lstMatch = this.data.lstMatch;
    lstMatch.forEach(match => {
      // 格式化列表中的日期
      match.strTime = app.formatDate(match.time, 'MM月dd日 ddd HH:mm')
      // 设置数据统计状态，0未完赛、1未统计、2不统计、9已结束
      if (match.status === 1) {
        match.statusName = '未统计';
      }
    });
    this.setData({
      lstMatch: lstMatch
    })
  },

  // 表格单击事件
  bindCellClick(e) {
    // 获取比赛对象match
    const match = e.currentTarget.dataset.item;
    // 获取首页的登录用户信息
    const loginPlayer = this.data.loginPlayer;
    let actionSheetTitle = '';
    this.setData({
      match: match
    })
    // 0技术统计、1比赛阵型、2阵型设置*、3编辑比赛*、4记录成绩*、5删除比赛*、6统计成绩*、7移除统计*
    const lstButton = [];
    if (match.status === 0) {
      // 比赛状态为0未记分时，底部按钮展示：1比赛阵型、2阵型设置*、3编辑比赛*、4记录成绩*、5删除比赛*
      // 未记分比赛列表，
      actionSheetTitle = match.strTime + ' ' + match.enemy;
      lstButton.push({ text: '比赛阵型', value: 1 });
      if (loginPlayer.role > 0) {
        lstButton.push({ text: '阵型设置*', value: 2 });
        lstButton.push({ text: '编辑比赛*', value: 3 });
        lstButton.push({ text: '删除比赛*', value: 5 });
        lstButton.push({ text: '记录成绩*', value: 4 });
      }
    } else {
      // 已结束比赛底部按钮，0技术统计、1比赛阵型、2阵型设置*、3编辑比赛*、4记录成绩*、6统计成绩*、7取消统计*
      actionSheetTitle = match.strTime + ' ' + match.goal + ' : ' + match.lose + ' ' + match.enemy;
      lstButton.push({ text: '技术统计', value: 0 });
      lstButton.push({ text: '比赛阵型', value: 1 });
      if (loginPlayer.role > 0) {
        if (match.status === 1) {
          // 状态为1未统计时
          lstButton.push({ text: '阵型设置*', value: 2 });
          lstButton.push({ text: '编辑比赛*', value: 3 });
          lstButton.push({ text: '记录成绩*', value: 4 });
          lstButton.push({ text: '统计成绩*', value: 6 });
        } else if (match.status === 2) {
          lstButton.push({ text: '取消统计*', value: 7 });
        }
      }
    }
    this.setData({
      showActionsheet: true,
      actionSheetTitle: actionSheetTitle,
      groups: lstButton
    })
  },

  // 底部弹起的操作列表点击按钮事件
  btnClick(e) {
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({
      showActionsheet: false
    })
    let lstMatch = this.data.lstMatch;
    const matchid = this.data.match._id;
    let url = '';
    // 0技术统计、1比赛阵型、2阵型设置*、3编辑比赛*、4记录成绩*、5删除比赛*、6统计成绩*、7取消统计*
    switch (e.detail.value) {
      case 0:
        // 技术统计，跳转到技术统计页面
        url = `../matchresult/view?matchid=` + matchid;
        wx.navigateTo({
          url: url
        })
        wx.hideLoading();
        break;
      case 1:
        // 比赛阵型，跳转到比赛阵型页面
        url = `../squad/view?matchid=` + matchid;
        wx.navigateTo({
          url: url
        })
        wx.hideLoading();
        break;
      case 2:
        // 阵型设置*，跳转到阵型设置页面
        url = `../squad/setting?matchid=` + matchid;
        wx.navigateTo({
          url: url
        })
        wx.hideLoading();
        break;
      case 3:
        // 编辑比赛*，跳转到发布比赛页面
        url = `match?matchid=` + matchid;
        wx.navigateTo({
          url: url
        })
        wx.hideLoading();
        break;
      case 4:
        // 记录成绩*，跳转到记录结果页面
        url = `../matchresult/gameover?matchid=` + matchid;
        wx.navigateTo({
          url: url
        })
        wx.hideLoading();
        break;
      case 5:
        // 删除比赛
        wx.cloud.callFunction({
          name: 'yun',
          data: {
            controller: 'match',
            action: 'remove',
            data: {
              _id: matchid
            }
          }
        }).then(res => {
          console.log('删除比赛成功', res);
          // 从列表中移除比赛
          for (let index = 0; index < lstMatch.length; index++) {
            const match = lstMatch[index];
            if (match._id === matchid) {
              lstMatch.splice(index, 1);
              break;
            }
          }
          this.setData({
            lstMatch: lstMatch,
            showActionsheet: false
          })
          wx.hideLoading();
        }).catch(err => {
          console.log('删除比赛失败', err);
          wx.hideLoading();
        })
        break;
      case 6:
        // 统计成绩*，统计成绩，修改比赛状态
        this.setData({
          dialogShow: true
        })
        wx.hideLoading();
        break;
      case 7:
        // 移除统计*，反向统计成绩，修改比赛状态
        this.setData({
          dialogShow: true
        })
        wx.hideLoading();
        break;
    }
  },

  // 沉淀统计数据
  chendian: async function () {
    wx.showLoading({
      title: '',
      mask: true
    })
    // 统计数据流程开始
    let matchid = this.data.match._id;
    let status = this.data.match.status;
    // 获取需要统计的比赛信息
    await this.getMatch(matchid);
    const match = this.data.match;
    if (match.status !== status) {
      console.log('比赛状态已经改变，停止数据统计');
      wx.hideLoading();
      return false;
    }
    // 状态 0未记分，1未统计，2已结束
    let multiplier = 1;
    if (status === 2) {
      // 状态为已结束时，乘数为-1;比赛状态更新为1未统计
      multiplier = -1;
      status = 1;
    } else {
      // 比赛状态更新为2已结束
      status = 2;
    }
    const year = this.data.searchParam.year;
    const month = this.data.searchParam.month;
    // 获取球队战绩月报
    await this.getTeamReportByMonth(month);
    // 初始化球队战绩月报
    let teamReport = this.data.teamReport;
    // 获取队员战绩年报
    await this.getStudentReportByYear(year);
    let lstStudentReport = this.data.lstStudentReport;
    // 获取当月现役队员
    await this.getPlayerListByMonth(this.data.searchParam);
    let lstPlayer = this.data.lstPlayer;
    const startDate = this.data.searchParam.startDate;
    const endDate = this.data.searchParam.endDate;
    // 将年报中没有的现役队员补充到年报中
    lstPlayer.forEach(player => {
      // 统计入队离队人数
      if (startDate <= player.joinday && endDate > player.joinday) {
        teamReport.join = teamReport.join + 1 * multiplier;
      }
      if (startDate <= player.leaveday && endDate > player.leaveday) {
        teamReport.leave = teamReport.leave + 1 * multiplier;
      }
      let student = app.searchByParam(lstStudentReport, "playerid", player._id);
      if (student) {
        student.joinday = player.joinday;
        student.leaveday = player.leaveday;
      } else {
        student = {
          playerid: player._id,
          joinday: player.joinday,
          leaveday: player.leaveday,
          year: year,
          match: 0,
          games: 0,
          times: 0,
          goal: 0,
          assist: 0,
          mvp: 0,
          win: 0,
          draw: 0,
          lost: 0
        }
        lstStudentReport.push(student);
      }
    });
    // 比赛成绩 false不统计，true统计
    if (match.dataflag === true) {
      // 统计总场次
      teamReport.match = teamReport.match + multiplier;
      // 统计胜、平、负
      if (match.goal > match.lose) {
        teamReport.win = teamReport.win + multiplier;
      } else if (match.goal < match.lose) {
        teamReport.lost = teamReport.lost + multiplier;
      } else {
        teamReport.draw = teamReport.draw + multiplier;
      }
      // 统计进、失球
      teamReport.goal = teamReport.goal + match.goal * multiplier;
      teamReport.lose = teamReport.lose + match.lose * multiplier;
    }
    const matchDate = new Date(app.formatDate(match.time, 'yyyy-MM-dd')).getTime();
    // 队员出勤 false不统计，true统计
    if (match.workflag === true) {
      // 遍历这个月的比赛过程中，球员出场次数、出场时间、进球、助攻、mvp数
      lstStudentReport.forEach(student => {
        // 队员在比赛时间已经加入球队且未退役
        if (new Date(student.joinday).getTime() <= matchDate && new Date(student.leaveday).getTime() > matchDate) {
          student.match = student.match + multiplier;
          let matchPlayer = app.searchByParam(match.playerlist, "playerid", student.playerid);
          // 队员是本次比赛对员
          if (matchPlayer) {
            // 队员出场次数+1
            student.games = student.games + multiplier;
            // 胜、平、负影响球员胜率
            if (match.goal > match.lose) {
              student.win = student.win + multiplier;
            } else if (match.goal < match.lose) {
              student.lost = student.lost + multiplier;
            } else {
              student.draw = student.draw + multiplier;
            }
            // 累计进球、助攻、mvp
            const playerScore = app.searchByParam(match.scorelist, "playerid", matchPlayer.playerid);
            if (playerScore) {
              student.goal = student.goal + playerScore.count * multiplier;
            }
            const playerAssist = app.searchByParam(match.assistlist, "playerid", matchPlayer.playerid);
            if (playerAssist) {
              student.assist = student.assist + playerAssist.count * multiplier;
            }
            const playerMvp = app.searchByParam(match.mvplist, "playerid", matchPlayer.playerid);
            if (playerMvp) {
              student.mvp = student.mvp + multiplier;
            }
          }
        } else {
          console.log(matchDate, student.playerid, new Date(student.joinday).getTime(), new Date(student.leaveday).getTime())
        }
      });
    }
    await this.addTeamReport(teamReport);
    await this.addStudentReport(year, lstStudentReport);
    // 更新比赛状态
    await this.updateMatchStatus(status);
    // 更新列表数据
    const lstMatch = this.data.lstMatch;
    for (let index = 0; index < lstMatch.length; index++) {
      const prevMatch = lstMatch[index];
      if (prevMatch._id === match._id) {
        // 格式化列表中的日期
        match.strTime = app.formatDate(match.time, 'MM月dd日 ddd HH:mm')
        // 设置数据统计状态，0未完赛、1未统计、2不统计、9已结束
        if (prevMatch.status === 1) {
          match.status = 2;
        } else if (prevMatch.status === 9) {
          match.status = 1;
          match.statusName = '未统计';
        }
        this.setData({
          dialogShow: false,
          [`lstMatch[` + index + `]`]: match
        })
        break;
      }
    }
    wx.hideLoading();
  },

  // 获取比赛信息
  async getMatch(matchid) {
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'match',
        action: 'get',
        data: {
          matchid: matchid
        }
      }
    }).then(res => {
      console.log('获取比赛信息成功', res);
      const match = res.result.data;
      const time = new Date(match.time);
      const matchYear = time.getFullYear();
      const matchMonth = time.getMonth() + 1;
      const month = matchYear * 100 + matchMonth;
      const startDate = app.formatDate(time, 'yyyy-MM-01');
      let endDate = '';
      if (matchMonth < 9) {
        endDate = matchYear + '-0' + (matchMonth + 1) + '-01';
      } else if (matchMonth === 12) {
        endDate = (matchYear + 1) + '-01-01';
      } else {
        endDate = matchYear + '-' + (matchMonth + 1) + '-01';
      }
      let searchParam = {
        year: matchYear,
        month: month,
        startDate: startDate,
        endDate: endDate
      }
      this.setData({
        match: match,
        searchParam: searchParam
      })
    }).catch(err => {
      console.log('获取比赛信息失败', err);
    })
  },

  // 获取球队战绩月报
  getTeamReportByMonth: async function (month) {
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'team',
        action: 'getByMonth',
        data: {
          month: month
        }
      }
    }).then(res => {
      // 正确的执行结果
      console.log('获取球队战绩月报成功', res);
      if (res.result.data.length > 0) {
        let teamReport = res.result.data[0];
        teamReport.join = 0;
        teamReport.leave = 0;
        this.setData({
          teamReport: teamReport
        })
      } else {
        this.setData({
          teamReport: {
            month: month,
            match: 0,
            win: 0,
            draw: 0,
            lost: 0,
            goal: 0,
            lose: 0,
            join: 0,
            leave: 0
          }
        })
      }
    }).catch(err => {
      // 错误的执行结果
      console.log('获取球队战绩月报失败', err);
    })
  },

  // 获取队员战绩年报
  getStudentReportByYear: async function (year) {
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'student',
        action: 'listByYear',
        data: year
      }
    }).then(res => {
      // 正确的执行结果
      console.log('获取队员战绩年报成功', res);
      if (res.result.data.length > 0) {
        this.setData({
          lstStudentReport: res.result.data[0].playerlist
        })
      } else {
        this.setData({
          lstStudentReport: []
        })
      }
    }).catch(err => {
      // 错误的执行结果
      console.log('获取队员战绩年报失败', err);
    })
  },

  // 根据月份获取现役队员
  getPlayerListByMonth: async function (searchParam) {
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'player',
        action: 'selectByMonth',
        data: searchParam
      }
    }).then(res => {
      // 正确的执行结果
      console.log('根据月份获取现役队员成功', res);
      this.setData({
        lstPlayer: res.result.data
      })
    }).catch(err => {
      // 错误的执行结果
      console.log('根据月份获取现役队员失败', err);
    })
  },

  // 新增球队战绩月报
  addTeamReport: async function (teamReport) {
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'team',
        action: 'add',
        data: teamReport
      }
    }).then(res => {
      console.log('新增球队战绩月报成功', res);
      wx.hideLoading();
    }).catch(err => {
      console.log('新增球队战绩月报失败', err);
      wx.hideLoading();
    })
  },

  // 新增队员战绩年报
  addStudentReport: async function (year, lstStudentReport) {
    const data = {
      year: year,
      lstStudentReport: lstStudentReport
    }
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'student',
        action: 'add',
        data: data
      }
    }).then(res => {
      console.log('新增队员战绩年报成功', res);
      wx.hideLoading();
    }).catch(err => {
      console.log('新增队员战绩年报失败', err);
      wx.hideLoading();
    })
  },
  // 更新比赛状态
  updateMatchStatus: async function (status) {
    const data = {
      _id: this.data.match._id,
      status: status
    }
    wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'match',
        action: 'updateStatus',
        data: data
      }
    }).then(res => {
      // 正确的执行结果
      console.log('更新比赛状态成功', res);
    }).catch(err => {
      // 错误的执行结果
      console.log('更新比赛状态失败', err);
    })
  }
})