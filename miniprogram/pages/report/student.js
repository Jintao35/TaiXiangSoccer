const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lstYear: [],
    yearIndex: 0,
    tabIndex: 0,
    lstTab: [
      { title: '出勤', count: '' },
      { title: '助攻', count: '' },
      { title: '进球', count: '' },
      { title: 'MVP', count: '' }
    ],
    lstStudentReport: [],
    lstPlayer: [],
    sortField: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    const date = new Date();
    const lstYear = [];
    let year = date.getFullYear();
    for (let i = date.getFullYear(); i >= 2021; i--) {
      lstYear.push(i);
    }
    this.setData({
      lstYear: lstYear
    })
    await this.getStudentReportByYear(year);
    this.formatStudentReport();
  },
  // 导航栏切换
  bindSwitchTab: function (e) {
    const tabIndex = e.detail.index;
    this.setData({
      tabIndex: tabIndex
    })
    this.sortPlayerList(null);
  },
  // 选择年份事件
  bindPickerChange: async function (e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`${field}`]: e.detail.value
    })
    await this.getStudentReportByYear(this.data.lstYear[e.detail.value]);
    this.formatStudentReport();
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

  // 格式化数据
  formatStudentReport() {
    let lstStudentReport = this.data.lstStudentReport;
    let lstPlayer = [];
    // 获取首页的球员列表
    let pages = getCurrentPages();
    let indexPage = pages[0];
    let lstAllPlayer = JSON.parse(JSON.stringify(indexPage.data.lstAllPlayer));
    // 格式化内容
    lstStudentReport.forEach(student => {
      let player = app.searchByParam(lstAllPlayer, "_id", student.playerid);
      let playerid = player._id;
      let name = player.name;
      if (player.disabled === false) {
        name = player.no + '.' + name;
      }
      let index = player.index;
      // 胜率
      const shenglv = (student.win / (student.games === 0 ? 1 : student.games) * 100).toFixed(2);
      // 出勤率
      let chuqinlv = 0;
      // 场均进球
      let goalavg = 0;
      // 场均助攻
      let assistavg = 0;
      // 场均MVP
      let mvpavg = 0;
      if (student.match > 0) {
        chuqinlv = (student.games / student.match * 100);
        if (student.games > 0) {
          goalavg = (student.goal / student.games);
          assistavg = (student.assist / student.games);
          mvpavg = (student.mvp / student.games);
        }
      }
      lstPlayer.push({
        index: index,
        playerid: playerid,
        name: name,
        games: student.games,
        shenglv: shenglv,
        chuqinlv: chuqinlv.toFixed(2),
        mvp: student.mvp,
        mvpavg: mvpavg.toFixed(2),
        assist: student.assist,
        assistavg: assistavg.toFixed(2),
        goal: student.goal,
        goalavg: goalavg.toFixed(2)
      });
    });
    this.setData({
      lstPlayer: lstPlayer
    })
    this.sortPlayerList(null);
  },

  // 表头点击事件
  bindTheadClick: function (e) {
    // 根据字段、序号排序
    const field = e.currentTarget.dataset.field;
    this.sortPlayerList(field);
  },

  // 表内容点击事件
  bindTbodyClick: function (e) {
    // 跳转到队员比赛统计页面
    const playerid = e.currentTarget.dataset.playerid;
    const url = `../report/detail?playerid=` + playerid;
    wx.navigateTo({
      url: url
    })
  },

  // 数据排序
  sortPlayerList(field) {
    const tabIndex = this.data.tabIndex;
    if (!field) {
      switch (tabIndex) {
        case 0:
          field = "chuqinlv";
          break;
        case 1:
          field = "assist";
          break;
        case 2:
          field = "goal";
          break;
        case 3:
          field = "mvp";
          break;
        default:
          field = "index";
          break;
      }
    }
    let lstPlayer = this.data.lstPlayer;
    lstPlayer.sort(function (star, next) {
      if (field === 'index') {
        return star.index - next.index;
      } else if (field === 'chuqinlv') {
        // 根据出勤率排序
        return next.chuqinlv === star.chuqinlv ? next.games - star.games : next.chuqinlv - star.chuqinlv;
      } else if (field === 'assist') {
        // 根据助攻数排序
        return next.assist === star.assist ? next.assistavg - star.assistavg : next.assist - star.assist;
      } else if (field === 'assist') {
        // 根据进球数排序
        return next.goal === star.goal ? next.goalavg - star.goalavg : next.goal - star.goal;
      } else if (field === 'assist') {
        // 根据MVP次数、场均MVP、场次数排序
        return next.mvp === star.mvp ? next.mvpavg === star.mvpavg ? next.games - star.games : next.mvpavg - star.mvpavg : next.mvp - star.mvp;
      } else {
        return (next[field] ? next[field] : 0) === (star[field] ? star[field] : 0) ?
          star.index - next.index : (next[field] ? next[field] : 0) - (star[field] ? star[field] : 0);
      }
    });
    this.setData({
      lstPlayer: lstPlayer,
      sortField: field
    })
  }
})