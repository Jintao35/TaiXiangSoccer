const app = getApp();
Page({
  data: {
    error: '',
    dialogShow: false,
    openid: '',
    buttons: [{ text: '确定' }],
    strJoinday: '',
    strBirthday: '',
    strLeaveday: '',
    player: {
      _id: '',
      index: 0,
      name: '',
      sex: true,
      foot: true,
      birthday: new Date(),
      height: '',
      weight: '',
      pic: '',
      memo: '',
      disabled: false,
      joinday: new Date(),
      leaveday: new Date(),
      no: '',
      role: 0,
      org: 0,
      positional: [],
      creater: '',
      updater: ''
    },
    lstOrg: ['本队', '试训', '外援'],
    lstRole: ['队员', '队长', '领队', '开发'],
    lstPosition: [
      { name: '前锋', value: 'ST', },
      { name: '左边锋', value: 'LW' },
      { name: '前腰', value: 'CAM' },
      { name: '右边锋', value: 'RW' },
      { name: '左边前卫', value: 'LM' },
      { name: '中前卫', value: 'CM' },
      { name: '右边前卫', value: 'RM' },
      { name: '左边翼卫', value: 'LWB' },
      { name: '后腰', value: 'CDM' },
      { name: '右边翼卫', value: 'RWB' },
      { name: '左边后卫', value: 'LB' },
      { name: '中后卫', value: 'CB' },
      { name: '右边后卫', value: 'RB' },
      { name: '守门员', value: 'GK' }
    ],
    rules: [
      { name: '_id', rules: { required: false } },
      { name: 'name', rules: { required: true, message: '姓名必填' } },
      { name: 'sex', rules: { required: false } },
      { name: 'foot', rules: { required: false } },
      { name: 'birthday', rules: { required: true, message: '生日必填' } },
      {
        name: 'height', rules: [
          { required: true, message: '身高必填' },
          { range: [50, 250], message: '身高不正确' }]
      },
      {
        name: 'weight', rules: [
          { required: true, message: '体重必填' },
          { range: [30, 150], message: '体重不正确' }],
      },
      { name: 'pic', rules: { required: false } },
      { name: 'memo', rules: { required: false } },
      { name: 'joinday', rules: { required: true, message: '入队日期必填' } },
      { name: 'leaveday', rules: { required: true, message: '入队日期必填' } },
      { name: 'index', rules: { required: false } },
      { name: 'no', rules: { required: false } },
      { name: 'role', rules: { required: true } },
      { name: 'org', rules: { required: true } },
      { name: 'positional', rules: { required: false } },
      { name: 'disabled', rules: { required: false } },
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
    const pages = getCurrentPages();
    const indexPage = pages[0];
    const updater = indexPage.data.loginPlayer._id;
    if (options.playerid) {
      wx.showLoading({
        title: '',
        mask: true
      })
      // 获取队员信息
      wx.cloud.callFunction({
        name: 'yun',
        data: {
          controller: 'player',
          action: 'get',
          data: {
            playerid: options.playerid
          }
        }
      }).then(res => {
        console.log('获取队员信息成功', res);
        let player = res.result.data;
        let birthday = new Date(player.birthday);
        let joinday = new Date(player.joinday);
        let leaveday = new Date(player.leaveday);
        player.updater = updater;
        let lstPosition = this.initPositional(player.positional);
        this.setData({
          strBirthday: app.formatDate(birthday, 'yyyy-MM-dd'),
          strJoinday: app.formatDate(joinday, 'yyyy-MM-dd'),
          strLeaveday: app.formatDate(leaveday, 'yyyy-MM-dd'),
          player: player,
          lstPosition: lstPosition
        })
        wx.hideLoading();
      }).catch(err => {
        console.log('获取队员信息失败', err);
        wx.hideLoading();
      })
    } else {
      // 新增时
      const lstIndexAllPlayer = indexPage.data.lstAllPlayer;
      // 获取现有最大序号
      const maxIndex = lstIndexAllPlayer[lstIndexAllPlayer.length - 1].index;
      let birthday = new Date('1990-06-15');
      let joinday = new Date();
      let leaveday = new Date('2099-12-31');
      this.setData({
        strBirthday: app.formatDate(birthday, 'yyyy-MM-dd'),
        strJoinday: app.formatDate(joinday, 'yyyy-MM-dd'),
        strLeaveday: app.formatDate(leaveday, 'yyyy-MM-dd'),
        [`player.index`]: maxIndex + 1,
        [`player.birthday`]: birthday,
        [`player.joinday`]: joinday,
        [`player.leaveday`]: leaveday,
        [`player.creater`]: updater,
        [`player.updater`]: updater
      })
    }
  },
  // 初始化擅长位置
  initPositional(positional) {
    let lstPosition = this.data.lstPosition;
    lstPosition.forEach(position => {
      if (app.containsKey(positional, 'position', position.value)) {
        position.checked = true;
      }
    });
    return lstPosition;
  },

  // 文本框输入事件
  formInputChange: function (e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`player.${field}`]: e.detail.value
    })
  },
  // 日期选择事件
  bindDateChange: function (e) {
    if (e.currentTarget.dataset.field === 'birthday') {
      this.setData({
        strBirthday: e.detail.value,
        [`player.birthday`]: e.detail.value
      })
    } else if (e.currentTarget.dataset.field === 'joinday') {
      this.setData({
        strJoinday: e.detail.value,
        [`player.joinday`]: e.detail.value
      })

    } else if (e.currentTarget.dataset.field === 'leaveday') {
      this.setData({
        strLeaveday: e.detail.value,
        [`player.leaveday`]: e.detail.value
      })
    }
  },
  // 下拉框选择事件
  bindPickerChange: function (e) {
    this.setData({
      [`player.` + e.currentTarget.dataset.field]: Number(e.detail.value)
    })
  },
  // 开关选择器选择事件
  bindSwitchChange: function (e) {
    this.setData({
      [`player.` + e.currentTarget.dataset.field]: e.detail.value ? true : false
    })
  },
  // 擅长位置选择事件
  bindPositionChange: function (e) {
    let lstPosition = this.data.lstPosition;
    let selValues = e.detail.value;
    lstPosition.forEach(position => {
      position.checked = false;
      if (selValues.indexOf(position.value) > -1) {
        position.checked = true;
        return;
      }
    });
    this.setData({
      lstPosition: lstPosition
    });
  },
  // 保存
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors)
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
        // 统计擅长位置
        let lstPosition = [];
        this.data.lstPosition.forEach(position => {
          if (position.checked) {
            lstPosition.push({ 'position': position.value, 'name': position.name });
          }
        });
        this.setData({
          [`player.positional`]: lstPosition
        })
        // 获取上一个页面信息
        const pages = getCurrentPages();
        const indexPage = pages[0];
        const prevPage = pages[pages.length - 2];
        const player = this.data.player;
        // 头像为空时使用默认头像
        if (!player.pic) {
          player.pic = app.data.emptyPic;
        }
        // 离队日期为空时使用2099-12-31
        if (!player.leaveday) {
          player.leaveday = '2099-12-31';
        }
        if (player._id) {
          // 更新队员
          wx.cloud.callFunction({
            name: 'yun',
            data: {
              controller: 'player',
              action: 'update',
              data: player
            }
          }).then(res => {
            // 正确的执行结果
            console.log('更新队员成功', res);
            if (player.disabled) {
              // 更新退役队员列表数据
              let lstPrevRetirePlayer = prevPage.data.lstRetirePlayer;
              for (let index = 0; index < lstPrevRetirePlayer.length; index++) {
                const prevPlayer = lstPrevRetirePlayer[index];
                if (prevPlayer._id === player._id) {
                  prevPage.setData({
                    [`lstRetirePlayer[` + index + `]`]: player
                  })
                  break;
                }
              }
            } else {
              // 更新现役队员列表数据
              let lstPrevActivePlayer = prevPage.data.lstActivePlayer;
              for (let index = 0; index < lstPrevActivePlayer.length; index++) {
                const prevPlayer = lstPrevActivePlayer[index];
                if (prevPlayer._id === player._id) {
                  indexPage.formatPlayer(player);
                  prevPage.setData({
                    [`lstActivePlayer[` + index + `]`]: player
                  })
                  break;
                }
              }
            }
            this.setData({
              dialogShow: true
            })
            wx.hideLoading();
          }).catch(err => {
            // 错误的执行结果
            console.log('更新队员失败', err);
            wx.hideLoading();
          })
        } else {
          // 新增队员
          wx.cloud.callFunction({
            name: 'yun',
            data: {
              controller: 'player',
              action: 'add',
              data: player
            }
          }).then(res => {
            console.log('新增队员成功', res);
            // 更新现役队员列表数据
            indexPage.formatPlayer(player);
            let lstPrevActivePlayer = prevPage.data.lstActivePlayer;
            lstPrevActivePlayer.unshift(player);
            prevPage.setData({
              [`lstTab[0].count`]: '' + lstPrevActivePlayer.length,
              lstActivePlayer: lstPrevActivePlayer
            })
            this.setData({
              dialogShow: true
            })
            wx.hideLoading();
          }).catch(err => {
            console.log('新增队员失败', err);
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