const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchParam: {
      year: 2022,
      month: 202201,
      startDate: '2022-01-01',
      endDate: '2022-02-01'
    },
    match: {},
    lstMatch: [],
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
  onLoad: function (options) {

  },
  bindWhat: async function (status) {
    status = 1
    const matchid = '5b049cc861e114f5059307ea514480d8';
    // 统计数据流程开始
    wx.showLoading({
      title: '',
      mask: true
    })
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

    // 计算这个月球队的总场次、胜、平、负、进球、失球数
    // 比赛成绩 false不统计，true统计
    if (match.dataflag === true) {
      // 统计比赛胜负数
      teamReport.match = teamReport.match + multiplier;
      if (match.goal > match.lose) {
        teamReport.win = teamReport.win + multiplier;
      } else if (match.goal < match.lose) {
        teamReport.lost = teamReport.lost + multiplier;
      } else {
        teamReport.draw = teamReport.draw + multiplier;
      }
      // 统计进球失球
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
            const playerScore = app.searchByParam(match.scorelist, "playerid", student.playerid);
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
    console.log(teamReport, lstStudentReport)
    await this.addTeamReport(teamReport);
    await this.addStudentReport(year, lstStudentReport);
    // 更新比赛状态
    await this.updateMatchStatus(status);
    wx.hideLoading();
  },
  // 保存按钮点击事件
  submitForm: async function () {
    const matchid = '5b049cc861e114f5059307ea514480d8';




    const year = this.data.searchParam.year;
    const month = this.data.searchParam.month;
    // 统计数据流程开始
    wx.showLoading({
      title: '',
      mask: true
    })
    // 获取球队战绩月报
    await this.getTeamReportByMonth(month)
    // 获取尚未统计的比赛信息
    await this.getMatchListByMonthAndStatus();
    const lstMatch = this.data.lstMatch;
    // 初始化球队战绩月报
    let teamReport = this.data.teamReport;
    teamReport.month = month;
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
        teamReport.join = teamReport.join + 1;
      }
      if (startDate <= player.leaveday && endDate > player.leaveday) {
        teamReport.leave = teamReport.leave + 1;
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

    console.log(lstMatch, teamReport, lstStudentReport)
    // 遍历这个月的比赛，计算这个月球队的总场次、胜、平、负、进球、失球数
    if (!lstMatch || lstMatch.length === 0) {
      // 没有比赛时不统计
      wx.hideLoading();
      return false;
    }
    lstMatch.forEach(match => {
      // 比赛成绩 false不统计，true统计
      if (match.dataflag === true) {
        // 统计比赛胜负数
        teamReport.match = teamReport.match + 1;
        if (match.goal > match.lose) {
          teamReport.win = teamReport.win + 1;
        } else if (match.goal < match.lose) {
          teamReport.lost = teamReport.lost + 1;
        } else {
          teamReport.draw = teamReport.draw + 1;
        }
        // 统计进球失球
        teamReport.goal = teamReport.goal + match.goal;
        teamReport.lose = teamReport.lose + match.lose;
      }
      const matchDate = new Date(app.formatDate(match.time, 'yyyy-MM-dd')).getTime();
      // 队员出勤 false不统计，true统计
      if (match.workflag === true) {
        // 遍历这个月的比赛过程中，球员出场次数、出场时间、进球、助攻、mvp数
        lstStudentReport.forEach(student => {
          // 队员在比赛时间已经加入球队且未退役
          if (new Date(student.joinday).getTime() <= matchDate && new Date(student.leaveday).getTime() > matchDate) {
            student.match = student.match + 1;
            let matchPlayer = app.searchByParam(match.playerlist, "playerid", student.playerid);
            // 队员是本次比赛对员
            if (matchPlayer) {
              // 队员出场次数+1
              student.games = student.games + 1;
              // 胜、平、负影响球员胜率
              if (match.goal > match.lose) {
                student.win = student.win + 1;
              } else if (match.goal < match.lose) {
                student.lost = student.lost + 1;
              } else {
                student.draw = student.draw + 1;
              }
              // 累计进球、助攻、mvp
              const playerScore = app.searchByParam(match.scorelist, "playerid", student.playerid);
              if (playerScore) {
                student.goal = student.goal + playerScore.count;
              }
              const playerAssist = app.searchByParam(match.assistlist, "playerid", matchPlayer.playerid);
              if (playerAssist) {
                student.assist = student.assist + playerAssist.count;
              }
              const playerMvp = app.searchByParam(match.mvplist, "playerid", matchPlayer.playerid);
              if (playerMvp) {
                student.mvp = student.mvp + 1;
              }
            }
          } else {
            console.log(matchDate, student.playerid, new Date(student.joinday).getTime(), new Date(student.leaveday).getTime())
          }
        });
      }
    });
    console.log(teamReport, lstStudentReport)
    await this.addTeamReport(teamReport);
    await this.addStudentReport(year, lstStudentReport);
    // 比赛改为已统计
    // await this.updateMatchStatus();
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
        this.setData({
          teamReport: teamReport
        })
      } else {
        this.setData({
          [`teamReport.month`]: month
        })
      }
    }).catch(err => {
      // 错误的执行结果
      console.log('获取球队战绩月报失败', err);
    })
  },

  // 获取指定月份中尚未统计的比赛信息
  getMatchListByMonthAndStatus: async function () {
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'match',
        action: 'listByMonth',
        data: this.data.searchParam
      }
    }).then(res => {
      // 正确的执行结果
      console.log('获取比赛列表成功', res);
      this.setData({
        lstMatch: res.result.data
      })
    }).catch(err => {
      // 错误的执行结果
      console.log('获取比赛列表失败', err);
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