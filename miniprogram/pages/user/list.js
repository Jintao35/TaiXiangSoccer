const app = getApp();
Page({
  data: {
    tabIndex: 0,
    tabBar: [
      {
        title: '未审核用户', count: '0'
      },
      {
        title: '已审核用户', count: '0',
      }
    ],
    loginPlayer: {},
    lstActivePlayer: [],
    lstWaitUser: [],
    lstBindUser: [],
    setParam: {
      userid: '',
      playerid: ''
    },
    removeParam: {
      userid: ''
    },
    dialogShow: false,
    showOneButtonDialog: false,
    buttons: [{ text: '取消' }, { text: '确定' }],
    oneButton: [{ text: '确定' }],
    lstPlayerIndex: 0,
    lstWaitUserIndex: 0,
    lstBindUserIndex: 0,
    showTopTips: false,
    error: ''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '',
      mask: true
    })
    const pages = getCurrentPages();
    const indexPage = pages[0];
    // 获取首页的登录信息
    const loginPlayer = indexPage.data.loginPlayer;
    // 获取首页的现役队员列表
    let lstActivePlayer = indexPage.data.lstActivePlayer;
    this.setData({
      loginPlayer: loginPlayer,
      lstActivePlayer: lstActivePlayer
    })
    // 新注册用户列表
    wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'user',
        action: 'list',
        data: {
          pageIndex: 1,
          pageSize: 100
        }
      }
    }).then(res => {
      // 正确的执行结果
      console.log('获取用户信息列表成功', res);
      let lstUser = res.result.data;
      let lstBindUser = this.data.lstBindUser;
      let lstWaitUser = this.data.lstWaitUser;
      lstUser.forEach(user => {
        // 格式化列表中的日期
        user.birthday = app.formatDate(user.birthday, 'yyyy年M月d日');
        if (user.playerid) {
          // 放入已审核用户列表
          const player = app.searchByParam(this.data.lstActivePlayer, '_id', user.playerid);
          user.playerNo = player.no;
          user.playerName = player.name;
          lstBindUser.push(user);
        } else {
          // 放入未审核用户列表
          lstWaitUser.push(user);
        }
      });
      let tabBar = this.data.tabBar;
      tabBar[0].count = '' + lstWaitUser.length;
      tabBar[1].count = '' + lstBindUser.length;
      this.setData({
        lstBindUser: lstBindUser,
        lstWaitUser: lstWaitUser,
        tabBar: tabBar
      })
      wx.hideLoading();
    }).catch(err => {
      // 错误的执行结果
      console.log('获取用户信息列表失败', err);
      wx.hideLoading();
    })
  },

  // 已审核用户列表选择事件
  bindBindUserChange: function (e) {
    let lstUser = this.data.lstBindUser;
    for (let i = 0, len = lstUser.length; i < len; ++i) {
      if (lstUser[i]._id == e.detail.value) {
        this.setData({
          lstBindUserIndex: i,
          [`removeParam.userid`]: lstUser[i]._id
        })
        break;
      }
    }
  },
  // 未审核用户列表选择事件
  bindWaitUserChange: function (e) {
    let lstUser = this.data.lstWaitUser;
    for (let i = 0, len = lstUser.length; i < len; ++i) {
      if (lstUser[i]._id == e.detail.value) {
        this.setData({
          lstWaitUserIndex: i,
          [`setParam.userid`]: lstUser[i]._id
        })
        break;
      }
    }
  },
  // 队员选择事件
  bindPlayerChange: function (e) {
    this.setData({
      lstPlayerIndex: e.detail.value,
      [`setParam.playerid`]: this.data.lstActivePlayer[e.detail.value]._id
    })
  },
  // 提示框按钮点击事件
  tapDialogButton(e) {
    if (e.detail.index == 0) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      this.setData({
        dialogShow: false,
        showOneButtonDialog: false
      })
    }
  },

  // 导航栏切换
  bindSwitchTabBar: function (e) {
    const tabIndex = e.detail.index;
    this.setData({
      tabIndex: tabIndex
    })
  },

  // 生成新队员
  addPlayer() {
    if (!this.data.param.userid) {
      this.setData({
        showTopTips: true,
        error: '请选择注册用户'
      })
      return false
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    // 新增队员
    wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'player',
        action: 'addPlayerByUser',
        data: {
          userid: this.data.setParam.userid
        }
      }
    }).then(res => {
      // 正确的执行结果
      console.log(res)
      let lstWaitUser = this.data.lstWaitUser;
      let lstBindUser = this.data.lstBindUser;
      // 获取队员姓名
      let user = lstWaitUser[this.data.lstWaitUserIndex];
      const player = app.searchByParam(this.data.lstActivePlayer, '_id', this.data.setParam.playerid);
      user.playerName = player.name;
      // 已审核列表追加用户
      lstBindUser.push(user);
      // 未审核列表移除用户
      lstWaitUser.splice(this.data.lstWaitUserIndex, 1);
      let tabBar = this.data.tabBar;
      tabBar[0].count = '' + lstWaitUser.length;
      tabBar[1].count = '' + lstBindUser.length;
      this.setData({
        dialogShow: true,
        [`setParam.userid`]: '',
        [`setParam.playerid`]: '',
        lstPlayerIndex: 0,
        lstBindUser: lstBindUser,
        lstWaitUser: lstWaitUser,
        tabBar: tabBar
      })
      wx.hideLoading()
    }).catch(err => {
      // 错误的执行结果
      console.log(err)
      wx.hideLoading()
    })
  },

  // 关联队员
  setPlayer() {
    if (!this.data.setParam.userid) {
      this.setData({
        showTopTips: true,
        error: '请选择注册用户'
      })
      return false;
    }
    if (!this.data.setParam.playerid) {
      this.setData({
        showTopTips: true,
        error: '请选择队员'
      })
      return false;
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    // 更新用户表的playerid
    wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'user',
        action: 'setPlayerid',
        data: this.data.setParam
      }
    }).then(res => {
      // 正确的执行结果
      console.log(res);
      let lstWaitUser = this.data.lstWaitUser;
      let lstBindUser = this.data.lstBindUser;
      // 获取队员姓名
      let user = lstWaitUser[this.data.lstWaitUserIndex];
      const player = app.searchByParam(this.data.lstActivePlayer, '_id', this.data.setParam.playerid);
      user.playerName = player.name;
      // 已审核列表追加用户
      lstBindUser.push(user);
      // 未审核列表移除用户
      lstWaitUser.splice(this.data.lstWaitUserIndex, 1);
      let tabBar = this.data.tabBar;
      tabBar[0].count = '' + lstWaitUser.length;
      tabBar[1].count = '' + lstBindUser.length;
      this.setData({
        dialogShow: true,
        [`setParam.userid`]: '',
        [`setParam.playerid`]: '',
        lstPlayerIndex: 0,
        lstBindUser: lstBindUser,
        lstWaitUser: lstWaitUser,
        tabBar: tabBar
      })
      wx.hideLoading();
    }).catch(err => {
      // 错误的执行结果
      console.log(err);
      wx.hideLoading();
    })
  },

  // 解除关联
  removePlayer() {
    if (!this.data.removeParam.userid) {
      this.setData({
        showTopTips: true,
        error: '请选择注册用户'
      })
      return false;
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    // 移除用户表的playerid
    wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'user',
        action: 'removePlayerid',
        data: this.data.removeParam
      }
    }).then(res => {
      // 正确的执行结果
      console.log(res);
      // 从列表中删除成功的用户
      let lstWaitUser = this.data.lstWaitUser;
      let lstBindUser = this.data.lstBindUser;
      // 未审核列表追加用户
      lstWaitUser.push(lstBindUser[this.data.lstBindUserIndex]);
      // 已审核列表移除用户
      lstBindUser.splice(this.data.lstBindUserIndex, 1);
      let tabBar = this.data.tabBar;
      tabBar[0].count = '' + lstWaitUser.length;
      tabBar[1].count = '' + lstBindUser.length;
      this.setData({
        dialogShow: true,
        [`removeParam.userid`]: '',
        lstPlayerIndex: 0,
        lstBindUser: lstBindUser,
        lstWaitUser: lstWaitUser,
        tabBar: tabBar
      })
      wx.hideLoading();
    }).catch(err => {
      // 错误的执行结果
      console.log(err);
      wx.hideLoading();
    })
  }
});