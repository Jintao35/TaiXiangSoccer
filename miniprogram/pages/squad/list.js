const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    lstTab: [
      { title: '第1节', count: '0' },
      { title: '第2节', count: '0' },
      { title: '第3节', count: '0' },
      { title: '第4节', count: '0' }
    ],
    selRow: -1,
    selCell: -1,
    selPlayerid: "",
    lstAllPlayer: [],
    lstMatchPlayer: [],
    lstPlayer: [],
    lstPlayerIndex: -1,
    match: {
      _id: "",
      quarterlist: [],
      playtimelist: [],
      updater: ""
    },
    dialogShow: false,
    buttons: [{ text: '确定' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    // 获取首页的现役队员列表
    let indexPage = pages[0];
    const lstAllPlayer = indexPage.data.lstAllPlayer;
    // 获取比赛信息页面的比赛信息数据
    let prevPage = pages[pages.length - 3];
    const match = prevPage.data.match;
    // 将比赛队员添加到候选队员列表
    let lstMatchPlayer = [];
    // 获取该场比赛全部队员
    match.playerlist.forEach(playtime => {
      let player = app.searchByParam(lstAllPlayer, "_id", playtime.playerid);
      player.checked = false;
      lstMatchPlayer.push(player);
    });
    this.setData({
      [`match._id`]: options.matchid,
      lstAllPlayer: lstAllPlayer,
      lstMatchPlayer: lstMatchPlayer
    })
    this.bindReturn();
  },

  // 位置设置样式
  squadClass(row, cell, className) {
    const tabIndex = this.data.tabIndex;
    let lstSquad = this.data.match.quarterlist[tabIndex].squadlist;
    lstSquad[row].lstCell[cell].class = className;
    this.setData({
      [`match.quarterlist[` + tabIndex + `].squadlist`]: lstSquad
    })
  },
  // 位置添加队员
  positionAddPlayer(row, cell, playerid) {
    let player = app.searchByParam(this.data.lstAllPlayer, '_id', playerid);
    if (!player) {
      return true;
    }
    const tabIndex = this.data.tabIndex;
    let squad = this.data.match.quarterlist[tabIndex];
    // 重设当前阵容人数
    const positionName = squad.squadlist[row].lstCell[cell].name;
    squad.lineuplist.push({ playerid: player._id, position: positionName });
    squad.squadlist[row].lstCell[cell].class = "";
    squad.squadlist[row].lstCell[cell].picked = true;
    squad.squadlist[row].lstCell[cell].player = player;
    this.setData({
      [`lstTab[` + tabIndex + `].count`]: '' + squad.lineuplist.length,
      [`match.quarterlist[` + tabIndex + `]`]: squad
    })
  },
  // 位置清除队员
  positionDelPlayer(row, cell) {
    const tabIndex = this.data.tabIndex;
    let squad = this.data.match.quarterlist[tabIndex];
    squad.squadlist[row].lstCell[cell].class = "";
    squad.squadlist[row].lstCell[cell].picked = false;
    // 重设当前阵容人数
    const positionName = squad.squadlist[row].lstCell[cell].name;
    for (let index = 0; index < squad.lineuplist.length; index++) {
      if (squad.lineuplist[index].position === positionName) {
        squad.lineuplist.splice(index, 1);
      }
    }
    delete squad.squadlist[row].lstCell[cell].player;
    this.setData({
      [`lstTab[` + tabIndex + `].count`]: '' + squad.lineuplist.length,
      [`match.quarterlist[` + tabIndex + `]`]: squad
    })
  },
  // 列表添加队员
  lstPlayerAdd(playerid) {
    let player = app.searchByParam(this.data.lstAllPlayer, '_id', playerid);
    if (!player) {
      return true;
    }
    let lstPlayer = this.data.lstPlayer;
    player.checked = false;
    lstPlayer.unshift(player);
    this.setData({
      lstPlayer: lstPlayer,
      lstPlayerIndex: -1
    })
  },
  // 列表清除队员
  lstPlayerDel() {
    if (this.data.lstPlayerIndex > -1) {
      let lstPlayer = this.data.lstPlayer;
      lstPlayer.splice(this.data.lstPlayerIndex, 1)
      this.setData({
        lstPlayer: lstPlayer,
        lstPlayerIndex: -1
      })
    }
  },
  // 上次记录
  setLast(row, cell, playerid, lstPlayerIndex) {
    this.setData({
      selRow: row,
      selCell: cell,
      selPlayerid: playerid,
      lstPlayerIndex: lstPlayerIndex
    })
  },
  // 导航栏切换
  bindSwitchTab: function (e) {
    // 清理上次位置
    const selRow = this.data.selRow;
    const selCell = this.data.selCell;
    if (selRow > -1 && selCell > -1) {
      this.squadClass(selRow, selCell, "");
    }
    // 清理上次选择
    this.setLast(-1, -1, "", -1);
    // 设置tab下标
    const tabIndex = e.detail.index;
    // 初始化候选队员列表
    this.initListPlayer(tabIndex);
    this.setData({
      tabIndex: tabIndex
    })
  },
  // 点击位置事件
  bindPositionClick(e) {
    wx.showLoading({
      title: '',
      mask: true
    })
    let lastPlayerid = this.data.selPlayerid;       // 上次队员id
    let lastRow = this.data.selRow;                 // 上次行
    let lastCell = this.data.selCell;               // 上次格
    let playerid = e.currentTarget.dataset.playerid;// 本次队员id
    let row = e.currentTarget.dataset.row;          // 本次位置
    let cell = e.currentTarget.dataset.cell;        // 本次位置
    if (playerid) {
      // 本次位置有队员
      if (lastPlayerid) {
        // 本次位置有队员 && 上次队员存在
        if (playerid === lastPlayerid) {
          // 本次位置有队员 && 上次队员存在 && 两次是同一队员
          // 1.本次位置清除队员
          this.positionDelPlayer(row, cell);
          // 2.队员列表添加本次队员
          this.lstPlayerAdd(playerid);
          // 3.清理上次选择
          this.setLast(-1, -1, "", -1);
        } else {
          // 本次位置有队员 && 上次队员存在 && 两次不是同一队员
          if (lastCell >= 0) {
            // 本次位置有队员 && 上次队员存在 && 两次不是同一队员 && 上次位置存在
            // 1.上次位置添加本次队员
            this.positionDelPlayer(lastRow, lastCell);
            this.positionAddPlayer(lastRow, lastCell, playerid);
            // 2.本次位置添加上次队员
            this.positionDelPlayer(row, cell);
            this.positionAddPlayer(row, cell, lastPlayerid);
            // 3.清理上次选择
            this.setLast(-1, -1, "", -1);
          } else {
            // 本次位置有队员 && 上次队员存在 && 两次不是同一队员 && 上次位置不存在
            // 1.本次位置添加上次队员
            this.positionDelPlayer(row, cell);
            this.positionAddPlayer(row, cell, lastPlayerid);
            // 2.队员列表移除上次队员
            this.lstPlayerDel(lastPlayerid);
            // 3.队员列表添加本次队员
            this.lstPlayerAdd(playerid);
            // 4.清理上次选择
            this.setLast(-1, -1, "", -1);
          }
        }
      } else {
        // 本次位置有队员 && 上次队员不存在
        // 1.记录本次选择
        this.setLast(row, cell, playerid, -1);
        // 2.更新本次位置样式
        this.squadClass(row, cell, "select");
      }
    } else {
      // 本次位置没队员
      if (lastPlayerid) {
        // 本次位置没队员 && 上次队员存在
        // 1.本次位置添加上次队员
        this.positionAddPlayer(row, cell, lastPlayerid);
        if (this.data.lstPlayerIndex > -1) {
          // 本次位置没队员 && 上次队员存在 && 队员列表选中
          // 2.队员列表移除本次队员
          this.lstPlayerDel(lastPlayerid);
        } else {
          // 本次位置没队员 && 上次队员存在 && 上次位置存在
          // 2.上次位置清除队员
          this.positionDelPlayer(lastRow, lastCell);
        }
        // 3.清空上次选择
        this.setLast(-1, -1, "", -1);
      } else {
        // 本次位置没队员 && 上次队员不存在
        // 什么都不做
      }
    }
    wx.hideLoading();
  },
  // 初始化候选队员列表
  initListPlayer(tabIndex) {
    const squad = this.data.match.quarterlist[tabIndex];
    let lstPlayer = JSON.parse(JSON.stringify(this.data.lstMatchPlayer));
    for (let index = lstPlayer.length - 1; index >= 0; index--) {
      lstPlayer[index].checked = false;
      if (squad.lineuplist.length > 0) {
        if (app.containsKey(squad.lineuplist, 'playerid', lstPlayer[index]._id)) {
          lstPlayer.splice(index, 1);
        }
      }
    }
    this.setData({
      lstPlayer: lstPlayer
    })
  },
  // 队员列表选择事件
  bindPlayerChange(e) {
    const lastPlayerid = this.data.selPlayerid; // 上次队员id
    const lastCell = this.data.selCell;         // 上次格
    if (lastCell > -1) {
      if (lastPlayerid) {
        const lastRow = this.data.selRow;       // 上次行
        // 恢复上次选中的单元格样式
        const tabIndex = this.data.tabIndex;
        let squad = this.data.match.quarterlist[tabIndex];
        squad.squadlist[lastRow].lstCell[lastCell].class = "";
        this.setData({
          [`match.quarterlist[` + tabIndex + `]`]: squad
        })
      }
      // 清理上次选择
      this.setLast(-1, -1, "", -1);
    }
    let lstPlayer = this.data.lstPlayer;
    let lstPlayerIndex = -1;
    let player;                               // 本次队员
    for (let i = 0, len = lstPlayer.length; i < len; ++i) {
      if (e.detail.value.indexOf(lstPlayer[i]._id) > -1) {
        lstPlayer[i].checked = true;
        lstPlayerIndex = i;
        player = lstPlayer[i];
      } else {
        delete lstPlayer[i].checked;
      }
    }
    // 记录本次选择
    this.setData({
      selPlayerid: player._id,
      lstPlayer: lstPlayer,
      lstPlayerIndex: lstPlayerIndex
    })
  },
  // 全清按钮点击事件
  bindClear() {
    const tabIndex = this.data.tabIndex;
    this.setData({
      [`lstTab[` + tabIndex + `].count`]: '0'
    })
    if (this.data.match.quarterlist.length > 0) {
      this.data.match.quarterlist[tabIndex].squadlist.forEach(row => {
        row.lstCell.forEach(cell => {
          if (cell.picked) {
            this.positionDelPlayer(row.rowIndex, cell.cellIndex);
          }
        });
      });
      this.setData({
        [`match.quarterlist[` + tabIndex + `].lineuplist`]: []
      })
      // 初始化候选队员列表
      this.initListPlayer(tabIndex);
    }
    this.setData({
      selRow: -1,
      selCell: -1,
      selPlayerid: "",
      lstPlayerIndex: -1
    })
  },
  // 重置按钮点击事件
  bindReturn() {
    wx.showLoading({
      title: '',
      mask: true
    })
    this.bindClear();
    const tabIndex = this.data.tabIndex;
    let setPlayerid = [];
    // 获取上一个页面
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    // 调用父页面的Data
    let quarterlist = JSON.parse(JSON.stringify(prevPage.data.quarterlist));
    let lstTab = JSON.parse(JSON.stringify(prevPage.data.lstTab));
    // 调用父父页面的比赛总时长
    prevPage = pages[pages.length - 3];
    const duration = prevPage.data.match.duration;
    for (let index = 0; index < lstTab.length; index++) {
      lstTab[index].count = '' + quarterlist[index].lineuplist.length;
    }
    for (let index = 3; index >= quarterlist.length; index--) {
      lstTab.splice(index, 1);
    }
    for (let index = 0; index < quarterlist.length;) {
      if (quarterlist[index].people === 0) {
        quarterlist.splice(index, 1);
      } else {
        quarterlist[index].squadlist.forEach(row => {
          row.lstCell.forEach(cell => {
            if (cell.checked === false && cell.picked === true) {
              // 格未被选中且有球员时，清理球员
              cell.class = '';
              cell.picked = false;
              delete cell.player;
            } else if (cell.checked === true && cell.picked === true) {
              setPlayerid.push(cell.player._id);
            }
          });
        });
        index++;
      }
    }
    this.setData({
      lstTab: lstTab,
      [`match.duration`]: duration,
      [`match.quarterlist`]: quarterlist
    });
    this.initListPlayer(tabIndex);
    wx.hideLoading();
  },
  // 计算队员出场时间
  computingTime() {
    // 队员出场时间 = 比赛总时长 / 比赛节数 * 队员首发节数
    const lstMatchPlayer = this.data.lstMatchPlayer;
    const quarterlist = this.data.match.quarterlist;
    // 每节比赛时长 = 比赛总时长 / 比赛节数
    let quarterMinutes = this.data.match.duration / this.data.match.quarterlist.length;
    let lstPlaytime = [];
    lstMatchPlayer.forEach(player => {
      lstPlaytime.push({ 'playerid': player._id, 'minutes': 0, positions: [] });
    });
    // 计算队员出场时间
    quarterlist.forEach(squad => {
      squad.lineuplist.forEach(playerPosition => {
        let playtime = app.searchByParam(lstPlaytime, 'playerid', playerPosition.playerid);
        playtime.minutes += quarterMinutes;
        if (playerPosition.position.length === 0) {
          playtime.positions.push({ 'position': playerPosition.position, 'minutes': quarterMinutes });
        } else {
          let positionTime = app.searchByParam(playtime.positions, 'position', playerPosition.position);
          if (positionTime) {
            positionTime.minutes += quarterMinutes;
          } else {
            playtime.positions.push({ 'position': playerPosition.position, 'minutes': quarterMinutes });
          }
        }
      });
    });
    this.setData({
      [`match.playtimelist`]: lstPlaytime
    })
  },

  // 查看队员出场时间
  bindPlaytime() {
    this.computingTime();
    // 跳转到队员出场时间页面
    wx.navigateTo({
      url: `../squad/playtime`
    })
  },

  // 保存按钮点击事件
  submitForm() {
    // 保存阵容
    wx.showLoading({
      title: '',
      mask: true
    })
    // 计算队员出场时间
    this.computingTime();
    wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'match',
        action: 'updateSquad',
        data: this.data.match
      }
    }).then(res => {
      // 正确的执行结果
      console.log('保存阵容成功', res);
      // 获取比赛列表页面
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 3];
      let lstMatch = prevPage.data.lstMatch;
      const match = this.data.match;
      lstMatch.forEach(prevMatch => {
        if (prevMatch._id === match._id) {
          prevMatch.quarterlist = match.quarterlist;
          return;
        }
      });
      // 调用父页面的setData()方法
      prevPage.setData({
        lstMatch: lstMatch
      })
      this.setData({
        dialogShow: true
      })
      wx.hideLoading();
    }).catch(err => {
      // 错误的执行结果
      console.log('保存阵容失败', err);
      wx.hideLoading();
    })
  },

  // 保存成功弹窗按钮点击事件
  tapDialogButton(e) {
    // 返回前2个页面
    wx.navigateBack({
      delta: 2
    })
  },
})