const app = getApp();
Page({
  data: {
    error: '',
    openid: '',
    signDialogShow: false,
    userActionShow: false,
    login: false,
    user: {},
    loginPlayer: {
      _id: '',
      name: '',
      pic: app.emptyPic,
      role: 0
    },
    lstAllPlayer: [],
    lstActivePlayer: [],
    lstRetirePlayer: [],
    signButtons: [{ text: '取消' }, { text: '立即注册' }],
    userActions: [
      { text: '修改信息', value: 0 },
      { text: '退出登录', type: "warn", value: 9 }
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '',
      mask: true
    })
    // 获取openid
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'user',
        action: 'openid',
        data: {}
      }
    }).then(res => {
      console.log('获取openid成功', res);
      this.setData({
        openid: res.result.data.OPENID
      })
      let playerid = wx.getStorageSync(this.data.openid);
      this.playerLogin(playerid);
      wx.hideLoading();
    }).catch(err => {
      console.log('获取openid异常', err);
      wx.hideLoading();
    })
  },
  // 队员登录
  playerLogin(playerid) {
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
      // 格式化队员列表
      let lstActivePlayer = [];
      let lstRetirePlayer = [];
      lstAllPlayer.forEach(player => {
        this.formatPlayer(player);
        if (player.disabled === true) {
          lstRetirePlayer.push(player);
        } else {
          lstActivePlayer.push(player);
        }
      });
      this.setData({
        lstAllPlayer: lstAllPlayer,
        lstActivePlayer: lstActivePlayer,
        lstRetirePlayer: lstRetirePlayer
      })
      let player = app.searchByParam(lstAllPlayer, '_id', playerid);
      if (player) {
        this.setData({
          loginPlayer: player,
          login: true,
        })
      }
    }).catch(err => {
      console.log('获取队员列表失败', err);
      wx.hideLoading();
    })
  },
  // 格式化队员列表
  formatPlayer(player) {
    let positions = "";
    switch (player.role) {
      case 0:
        player.roleName = '队员';
        break;
      case 1:
        player.roleName = '队长';
        break;
      case 2:
        player.roleName = '领队';
        break;
      case 3:
        player.roleName = '开发';
        break;
      default:
        player.roleName = '未知';
        break;
    }
    switch (player.org) {
      case 0:
        player.orgName = '本队';
        break;
      case 1:
        player.orgName = '试训';
        break;
      case 2:
        player.orgName = '外援';
        break;
      default:
        player.orgName = '未知';
        break;
    }
    if (player.positional) {
      player.positional.forEach(position => {
        positions += position.position + " ";
      });
      player.positions = positions;
    }
    player.age = app.getAge(new Date(player.birthday));
    if (player.disabled === true) {
      player.name = player.name + "[退]";
    }
  },
  // 登录按钮点击事件
  tapLoginClick: async function () {
    wx.showLoading({
      title: '',
      mask: true
    })
    // 查询是否有此用户，若没有该人物需要进行注册
    await wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'user',
        action: 'getByOpenid',
        data: {
          openid: this.data.openid
        }
      }
    }).then(res => {
      console.log('获取用户注册信息成功', res);
      if (res.result.data.length > 0) {
        let user = res.result.data[0];
        // 存在该用户
        if (user.playerid) {
          // 存在playerid，将openid和playerid记录缓存，登录状态改为已登录
          wx.setStorageSync(user.openid, user.playerid);
          this.setData({
            user: user
          })
          this.playerLogin(user.playerid);
        } else {
          // 提示请等待管理员开通
          this.setData({
            error: "请等待管理员开通账号"
          })
        }
      } else {
        this.setData({
          signDialogShow: true
        })
      }
      wx.hideLoading();
    }).catch(err => {
      console.log('获取用户注册信息失败', err);
      wx.hideLoading();
    })
  },
  // 用户头像点击事件
  tapPicClick() {
    this.setData({
      userActionShow: true
    })
  },
  // 用户基本操作按钮点击事件
  tapUserActionClick(e) {
    if (e.detail.value === 0) {
      wx.navigateTo({
        url: `./../user/user`
      })
      this.setData({
        userActionShow: false
      })
    } else if (e.detail.value === 9) {
      // 退出登录
      wx.removeStorage({ key: this.data.openid });
      this.setData({
        user: {},
        loginPlayer: {},
        login: false,
        userActionShow: false
      })
    }
  },
  // 注册按钮点击事件
  tapSignDialogClick(e) {
    if (e.detail.index === 1) {
      wx.navigateTo({
        url: `./../user/ok`
      })
    }
    this.setData({
      signDialogShow: false
    })
  },
})