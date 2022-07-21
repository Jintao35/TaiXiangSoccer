const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    updater: '',
    lstActivePlayer: [],
    lstRetirePlayer: [],
    player: {},
    tabIndex: 0,
    lstTab: [
      { title: '现役', count: '' },
      { title: '退役', count: '' }
    ],
    showActionsheet: false,
    actionSheetTitle: '',
    lstButton: [],
    buttons: [{ text: '确定' }],
    showDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '',
      mask: true
    })
    // 获取所有现役队员
    wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'player',
        action: 'list',
        data: {
          pageIndex: 1,
          pageSize: 99
        }
      }
    }).then(res => {
      console.log('获取队员列表成功', res)
      let lstAllPlayer = res.result.data;
      // 获取首页
      let pages = getCurrentPages();
      let indexPage = pages[0];
      const updater = indexPage.data.loginPlayer._id;
      // 格式化队员列表
      let lstActivePlayer = [];
      let lstRetirePlayer = [];
      lstAllPlayer.forEach(player => {
        indexPage.formatPlayer(player);
        if (player.disabled === true) {
          lstRetirePlayer.push(player);
        } else {
          lstActivePlayer.push(player);
        }
      });
      indexPage.setData({
        lstAllPlayer: lstAllPlayer,
        lstActivePlayer: lstActivePlayer,
        lstRetirePlayer: lstRetirePlayer
      })
      this.setData({
        [`lstTab[0].count`]: '' + lstActivePlayer.length,
        [`lstTab[1].count`]: '' + lstRetirePlayer.length,
        updater: updater,
        lstActivePlayer: lstActivePlayer,
        lstRetirePlayer: lstRetirePlayer
      })
      wx.hideLoading();
    }).catch(err => {
      console.log('获取队员列表失败', err)
      wx.hideLoading();
    })
  },

  // 导航栏切换
  bindSwitchTab: function (e) {
    const tabIndex = e.detail.index;
    this.setData({
      tabIndex: tabIndex
    })
  },

  // 表格单击事件
  bindCellClick(e) {
    const tabIndex = this.data.tabIndex;
    // 获取队员信息
    const player = e.currentTarget.dataset.item;
    let actionSheetTitle = player.no + '.' + player.name;
    let lstButton = [];
    if (tabIndex === 0) {
      lstButton.push({ text: '新增队员', value: 0 });
    }
    lstButton.push({ text: '修改队员', value: 1 });
    lstButton.push({ text: '查看头像', value: 2 });
    this.setData({
      player: player,
      showActionsheet: true,
      actionSheetTitle: actionSheetTitle,
      lstButton: lstButton
    })
  },

  // 底部弹起的操作列表点击按钮事件
  btnClick(e) {
    wx.showLoading({
      title: '',
      mask: true
    })
    // 0新增队员,1修改队员,2队员挂靴,3队员复出
    switch (e.detail.value) {
      case 0:
        // 0新增队员
        wx.navigateTo({
          url: `info`,
        })
        this.setData({
          showActionsheet: false
        })
        wx.hideLoading();
        break;
      case 1:
        // 1修改队员
        const playerid = this.data.player._id;
        let url = `info?playerid=` + playerid;
        wx.navigateTo({
          url: url,
        })
        this.setData({
          showActionsheet: false
        })
        wx.hideLoading();
        break;
      case 2:
        this.setData({
          showActionsheet: false,
          showDialog: true
        })
        wx.hideLoading();
        break;
      default:
        this.setData({
          showActionsheet: false
        })
        wx.hideLoading();
        break;
    }
  },
  // 提示框按钮点击事件
  tapDialogButton(e) {
    this.setData({
      showDialog: false
    })
  },
})