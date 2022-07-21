const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginPlayerRole: 0,
    error: '',
    dialogShow: false,
    buttons: [{ text: '确定' }],
    strDate: '',
    dtpDate: '',
    strTime: '16:00',
    chargeIndex: 1,
    competitionIndex: 0,
    stadiumIndex: 0,
    enemyIndex: 0,
    colorIndex: 0,
    lstCharge: ['免费', 'AA制', '上场时间'],
    lstStatus: ['未结束', '已结束'],
    lstCompetition: ['友谊赛', '约战体验赛', '联赛', '杯'],
    lstStadium: ['八五新星', '圣诺', '拓博', '华南欧翠', '子昂', '亚细亚', '超赞', '鹏辉建设'],
    lstEnemy: ['亮仔活鲜', '海友', 'man联', '学习人'],
    lstColor: [
      { id: 0, color: 'rgba(255, 255, 255)', name: '白' },
      { id: 1, color: 'rgba(255, 160, 255)', name: '粉' },
      { id: 2, color: 'rgba(255, 64, 64)', name: '红' },
      { id: 3, color: 'rgba(255, 160, 64)', name: '橙' },
      { id: 4, color: 'rgba(255, 255, 64)', name: '黄' },
      { id: 5, color: 'rgba(160, 255, 160)', name: '绿' },
      { id: 6, color: 'rgba(160, 255, 255)', name: '青' },
      { id: 7, color: 'rgba(64, 160, 255)', name: '蓝' },
      { id: 8, color: 'rgba(64, 160, 160)', name: '蓝绿' },
      { id: 9, color: 'rgba(160, 64, 160)', name: '紫' },
      { id: 10, color: 'rgba(160, 160, 64)', name: '橄榄' },
      { id: 11, color: 'rgba(160, 160, 160)', name: '灰色' },
      { id: 12, color: 'rgba(64, 64, 64)', name: '黑色' }
    ],
    cboColor: ['白', '粉', '红', '橙', '黄', '绿', '青', '蓝', '蓝绿', '紫', '橄榄', '灰色', '黑色'],
    match: {
      _id: '',
      time: '',
      duration: 120,
      charge: 1,
      fee: 250,
      competition: '友谊赛',
      stadium: '',
      man: 9,
      enemy: '',
      color1: '',
      color2: '',
      memo: '',
      playerlist: [],
      goal: 0,
      lose: 0,
      scorelist: [],
      assistlist: [],
      mvplist: [],
      lvplist: [],
      dataflag: true,
      workflag: true,
      status: 0,
      creater: '',
      updater: ''
    },
    rules: [
      { name: '_id', rules: { required: false } },
      { name: 'time', rules: { required: false } },
      { name: 'duration', rules: { required: false } },
      { name: 'charge', rules: { required: false } },
      {
        name: 'fee', rules: [
          { required: false },
          { range: [0, 999], message: '场地费不正确' }]
      },
      { name: 'competition', rules: { required: true, message: '比赛类型必填' } },
      { name: 'stadium', rules: { required: true, message: '比赛场地必填' } },
      { name: 'man', rules: { required: false } },
      { name: 'enemy', rules: { required: true, message: '比赛对手必填' } },
      { name: 'color1', rules: { required: false } },
      { name: 'memo', rules: { required: false } },
      { name: 'playerlist', rules: { required: false } },
      { name: 'goal', rules: { required: false } },
      { name: 'lose', rules: { required: false } },
      { name: 'scorelist', rules: { required: false } },
      { name: 'assistlist', rules: { required: false } },
      { name: 'mvplist', rules: { required: false } },
      { name: 'lvplist', rules: { required: false } },
      { name: 'dataflag', rules: { required: false } },
      { name: 'workflag', rules: { required: false } },
      { name: 'status', rules: { required: false } },
      { name: 'creater', rules: { required: false } },
      { name: 'createtime', rules: { required: false } },
      { name: 'updater', rules: { required: false } },
      { name: 'updatetime', rules: { required: false } }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取首页的playerid
    let pages = getCurrentPages();
    let indexPage = pages[0];
    const updater = indexPage.data.loginPlayer._id;
    const loginPlayerRole = indexPage.data.loginPlayer.role;
    if (options.matchid) {
      // 修改比赛时先获取比赛信息
      wx.showLoading({
        title: '',
        mask: true
      })
      wx.cloud.callFunction({
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
        const lstAllPlayer = indexPage.data.lstAllPlayer;
        let match = res.result.data;
        let time = new Date(match.time);
        match.updater = updater;
        // 进球队员
        let strscorelist = '';
        for (let count = 6; count > 0; count--) {
          match.scorelist.forEach(score => {
            if (score.count === count) {
              const player = app.searchByParam(lstAllPlayer, '_id', score.playerid);
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
              const player = app.searchByParam(lstAllPlayer, '_id', assist.playerid);
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
          const player = app.searchByParam(lstAllPlayer, '_id', mvp.playerid);
          strmvplist += ' ' + player.no + '.' + player.name;
        });
        this.setData({
          loginPlayerRole, loginPlayerRole,
          strDate: app.formatDate(time, 'yyyy-MM-dd ddd'),
          dtpDate: app.formatDate(time, 'yyyy-MM-dd'),
          strTime: app.formatDate(time, 'HH:mm'),
          match: match,
          strscorelist: strscorelist,
          strassistlist: strassistlist,
          strmvplist: strmvplist
        })
        wx.hideLoading();
      }).catch(err => {
        console.log('获取比赛信息失败', err);
        wx.hideLoading();
      })
    } else {
      // 新增比赛信息
      // 比赛时间默认三天后
      const threeDaysLater = new Date().getTime() + 3 * 86400000;
      const strDate = app.formatDate(new Date(threeDaysLater), 'yyyy-MM-dd ddd');
      const strDateYMD = app.formatDate(new Date(threeDaysLater), 'yyyy-MM-dd ');
      const strTime = '16:00';
      const matchTime = strDateYMD + strTime;
      // 格式化所有日期时间
      this.setData({
        loginPlayerRole, loginPlayerRole,
        dtpDate: app.formatDate(new Date(threeDaysLater), 'yyyy-MM-dd'),
        strDate: strDate,
        strTime: strTime,
        [`match.time`]: matchTime,
        [`match.creater`]: updater
      })
    }
  },

  // 文本框输入事件
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`match.${field}`]: e.detail.value
    })
  },
  // 滚动选择器选择事件
  bindPickerChange: function (e) {
    this.setData({
      [`match.` + e.currentTarget.dataset.field]: Number(e.detail.value)
    })
  },
  // 滑动选择器选择事件
  bindSliderChange: function (e) {
    this.setData({
      [`match.` + e.currentTarget.dataset.field]: e.detail.value
    })
  },
  // 开关选择器选择事件
  bindSwitchChange: function (e) {
    this.setData({
      [`match.` + e.currentTarget.dataset.field]: e.detail.value ? true : false
    })
  },
  // 比赛日期选择事件
  bindDateChange: function (e) {
    this.setData({
      strDate: app.formatDate(e.detail.value, 'yyyy-MM-dd ddd'),
      dtpDate: e.detail.value,
      [`match.time`]: e.detail.value + ' ' + this.data.strTime
    })
  },
  // 比赛时间选择事件
  bindTimeChange: function (e) {
    this.setData({
      strTime: e.detail.value,
      [`match.time`]: app.formatDate(this.data.dtpDate, 'yyyy-MM-dd ') + e.detail.value
    })
  },
  // 比赛类型选择事件
  bindCompetitionChange: function (e) {
    this.setData({
      [`match.competition`]: this.data.lstCompetition[e.detail.value]
    })
  },
  // 比赛场地选择事件
  bindStadiumChange: function (e) {
    this.setData({
      [`match.stadium`]: this.data.lstStadium[e.detail.value]
    })
  },
  // 比赛对手选择事件
  bindEnemyChange: function (e) {
    this.setData({
      [`match.enemy`]: this.data.lstEnemy[e.detail.value]
    })
  },
  // 对手颜色选择事件
  bindColorChange: function (e) {
    this.setData({
      [`match.color1`]: this.data.lstColor[e.detail.value].color
    })
  },
  // 比赛队员选择事件
  bindChangePlayer: function () {
    wx.navigateTo({
      url: `../match/players`,
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
  // MVP队员选择事件
  bindMvpPlayer: function () {
    let url = `../matchresult/mvp`;
    wx.navigateTo({
      url: url
    })
  },

  // 保存
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors);
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      } else {
        wx.showLoading({
          title: '',
          mask: true
        })
        let match = this.data.match;
        if (match.charge === 0) {
          // 收费模式为0免费时，场地费用等于0
          match.fee = 0;
        } else {
          match.fee = parseInt(match.fee);
        }
        if (match.status === 0) {
          // 进度状态为0未完赛时，进球数、失球数等于0，进球队员、助攻队员为空
          match.goal = 0;
          match.lose = 0;
          match.scorelist = [];
          match.assistlist = [];
        }
        if (match._id) {
          // 更新比赛
          wx.cloud.callFunction({
            name: 'yun',
            data: {
              controller: 'match',
              action: 'update',
              data: this.data.match
            }
          }).then(res => {
            // 正确的执行结果
            console.log('更新比赛成功', res);
            const match = this.data.match;
            // 获取上一个页面的比赛列表
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 2];
            // 更新比赛信息页面的列表数据
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
            this.setData({
              dialogShow: true
            })
            wx.hideLoading();
          }).catch(err => {
            // 错误的执行结果
            console.log('更新比赛失败', err);
            wx.hideLoading();
          })
        } else {
          // 新增比赛
          wx.cloud.callFunction({
            name: 'yun',
            data: {
              controller: 'match',
              action: 'add',
              data: this.data.match
            }
          }).then(res => {
            // 正确的执行结果
            console.log('新增比赛成功', res);
            this.setData({
              dialogShow: true
            })
            wx.hideLoading();
          }).catch(err => {
            // 错误的执行结果
            console.log('新增比赛失败', err);
            wx.hideLoading();
          })
        }
      }
    })
  },
  // 保存成功弹窗按钮点击事件
  tapDialogButton(e) {
    wx.navigateBack({
      delta: 1
    })
  }
});