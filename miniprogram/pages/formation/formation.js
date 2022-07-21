const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    lstTab: [
      { title: '首发队员', count: '0' },
      { title: '候补队员', count: '0' }
    ],
    squadlist: app.data.lstSquad,
    formation: {
      creater: '',
      lineuplist: []
    },
    sofifa: {},
    sortField: '',
    lstPosition: ['ST', 'LW', 'RW', 'CAM', 'LM', 'RM', 'CM', 'CDM', 'LWB', 'RWB', 'LB', 'RB', 'CB', 'GK'],
    fifa: null,
    lastSelect: 0,  // 上次选择对象 0没有选择，1候补队员，2首发队员
    nowSelete: 0,   // 本次选择对象 0没有选择，1候补队员，2首发队员
    creater: '',
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //  页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象
    this.tabBar = this.selectComponent('#tabBar')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '',
      mask: true
    })
    // 获取sofifa信息
    wx.cloud.callFunction({
      name: 'yun',
      data: {
        controller: 'sofifa',
        action: 'get',
        data: {}
      }
    }).then(res => {
      console.log('获取队员能力信息成功', res);
      let sofifa = res.result.data;
      // 获取首页
      const pages = getCurrentPages();
      const indexPage = pages[0];
      const creater = indexPage.data.loginPlayer._id;
      // 获取首页的队员列表
      const lstAllPlayer = JSON.parse(JSON.stringify(indexPage.data.lstAllPlayer));
      sofifa.fifalist.forEach(fifa => {
        let player = app.searchByParam(lstAllPlayer, '_id', fifa.playerid);
        fifa.player = player;
        fifa.player.strBirthday = app.formatDate(player.birthday, 'yyyy-MM-dd');
      });
      this.setData({
        [`lstTab[1].count`]: '' + sofifa.fifalist.length,
        sofifa: sofifa,
        creater: creater
      })
      wx.hideLoading();
    }).catch(err => {
      console.log('获取队员能力信息失败', err);
      wx.hideLoading();
    })



    // // 获取自己创建的阵容模拟信息
    // wx.showLoading({
    //   title: '',
    //   mask: true
    // })
    // // 获取首页的playerid
    // let pages = getCurrentPages();
    // let indexPage = pages[0];
    // let playerid = indexPage.data.loginPlayer._id;
    // wx.cloud.callFunction({
    //   name: 'yun',
    //   data: {
    //     controller: 'formation',
    //     action: 'get',
    //     data: {
    //       creater: playerid
    //     }
    //   }
    // }).then(res => {
    //   console.log('获取阵容模拟信息成功', res);
    //   const result = res.result.data;
    //   if (result.length > 0) {
    //     let formation = result[0];
    //     // 设置过阵容
    //     const quarterlist = JSON.parse(JSON.stringify(formation.quarterlist));
    //     this.setData({
    //       formation: formation,
    //       quarterlist: quarterlist
    //     })
    //   } else {
    //     // 未设置过阵容
    //     let formation = {
    //       creater: playerid,
    //       quarterlist: []
    //     }
    // this.drawSquad(8);
    //     formation.quarterlist = JSON.parse(JSON.stringify(this.data.quarterlist));
    //     this.setData({
    //       formation: formation,
    //       [`quarterlist[0].people`]: 11
    //     })
    //   }
    //   wx.hideLoading();
    // }).catch(err => {
    //   console.log('获取阵容模拟信息失败', err);
    //   wx.hideLoading();
    // })
  },

  // 重置按钮点击事件
  bindReset() {
    // const formation = this.data.formation;
    // let lstTab = [];
    // const quarterlist = JSON.parse(JSON.stringify(formation.quarterlist));
    // for (let index = 0; index < quarterlist.length; index++) {
    //   lstTab.push({ title: '阵容' + (index + 1), count: '' + quarterlist[index].people });
    // }
    // this.setData({
    //   lstTab: lstTab,
    //   quarterlist: quarterlist
    // })
  },

  // 导航栏切换
  bindSwitchTab: function (e) {
    const tabIndex = e.detail.index;
    this.setData({
      tabIndex: tabIndex
    })
  },

  // // 初始化擅长位置
  // initSquad(positionRating) {
  //   let lstSquad = this.data.lstSquad;
  //   lstSquad[0].lstCell[0].rating = positionRating.ST;
  //   lstSquad[0].lstCell[1].rating = positionRating.ST;
  //   lstSquad[0].lstCell[2].rating = positionRating.ST;
  //   lstSquad[1].lstCell[0].rating = positionRating.LW;
  //   lstSquad[1].lstCell[1].rating = positionRating.CAM;
  //   lstSquad[1].lstCell[2].rating = positionRating.CAM;
  //   lstSquad[1].lstCell[3].rating = positionRating.CAM;
  //   lstSquad[1].lstCell[4].rating = positionRating.RW;
  //   lstSquad[2].lstCell[0].rating = positionRating.LM;
  //   lstSquad[2].lstCell[1].rating = positionRating.CM;
  //   lstSquad[2].lstCell[2].rating = positionRating.CM;
  //   lstSquad[2].lstCell[3].rating = positionRating.CM;
  //   lstSquad[2].lstCell[4].rating = positionRating.RM;
  //   lstSquad[3].lstCell[0].rating = positionRating.LWB;
  //   lstSquad[3].lstCell[1].rating = positionRating.CDM;
  //   lstSquad[3].lstCell[2].rating = positionRating.CDM;
  //   lstSquad[3].lstCell[3].rating = positionRating.CDM;
  //   lstSquad[3].lstCell[4].rating = positionRating.RWB;
  //   lstSquad[4].lstCell[0].rating = positionRating.LB;
  //   lstSquad[4].lstCell[1].rating = positionRating.CB;
  //   lstSquad[4].lstCell[2].rating = positionRating.CB;
  //   lstSquad[4].lstCell[3].rating = positionRating.CB;
  //   lstSquad[4].lstCell[4].rating = positionRating.RB;
  //   lstSquad[5].lstCell[0].rating = positionRating.GK;
  //   this.setData({
  //     lstSquad: lstSquad
  //   })
  // },

  // 候补队员表格单击事件
  bindFifaClick(e) {
    // 获取队员信息
    const fifa = e.currentTarget.dataset.item;
    let squadlist = this.data.squadlist;
    // 遍历位置，设置位置能力
    squadlist.forEach(row => {
      row.lstCell.forEach(cell => {
        cell.value = fifa.positionRating[cell.name];
      });
    });

    this.setData({
      squadlist: squadlist,
      tabIndex: 0,
      lastSelect: 1,  // 上次选择对象 0没有选择，1候补队员，2首发队员
      fifa: fifa
    })
    // 切换面包屑
    let tabBar = this.tabBar;
    tabBar.manual_tabBar(0);  // 调用自定义组件中的方法
  },

  // 六维列表表头点击事件
  bindTheadClick: function (e) {
    // 根据字段、序号排序
    const field = e.currentTarget.dataset.field;
    const lstPosition = this.data.lstPosition;
    let sofifa = this.data.sofifa;
    this.data.sofifa.fifalist.sort(function (star, next) {
      if (field === 'index') {
        return star.index - next.index;
      } else if (field === 'before') {
        return (next.before ? next.before : 0) - (star.before ? star.before : 0);
      } else if (field === 'position') {
        return lstPosition.indexOf(star.position) - lstPosition.indexOf(next.position);
      } else {
        return (next[field] ? next[field] : 0) === (star[field] ? star[field] : 0) ? star.index - next.index : (next[field] ? next[field] : 0) - (star[field] ? star[field] : 0);
      }
    });
    this.setData({
      sofifa: sofifa,
      sortField: field
    })
  },

  // 位置点击事件
  bindPositionClick(e) {
    // 上次选择对象 0没有选择，1候补队员，2首发队员
    const lastSelect = this.data.lastSelect;
    wx.showLoading({
      title: '',
      mask: true
    })
    const lastFifa = this.data.fifa;                // 上次队员
    let lastRow = this.data.selRow;                 // 上次行
    let lastCell = this.data.selCell;               // 上次格
    let playerid = e.currentTarget.dataset.playerid;// 本次队员id
    let row = e.currentTarget.dataset.row;          // 本次位置
    let cell = e.currentTarget.dataset.cell;        // 本次位置
    if (playerid) {
      // 本次位置有队员
      // 获取阵型列表
      let squadlist = this.data.squadlist;
      // 获取本次选择的队员
      const fifa = squadlist[row].lstCell[cell].fifa;
      if (lastSelect === 1) {
        // 本次位置有队员 && 上次选择是1候补队员
        // 1.本次位置清除队员
        this.positionDelPlayer(row, cell);
        // 2.本次位置添加上次队员
        this.positionAddPlayer(row, cell, lastFifa);
        // 3.队员列表移除上次队员
        this.lstPlayerDel(lastFifa.player._id);
        // 4.队员列表添加本次队员
        this.lstPlayerAdd(fifa);
        // 5.清理上次选择
        this.clearSelect();
      } else if (lastSelect === 2) {
        // 本次位置有队员 && 上次选择是2首发队员
        if (lastRow === row && lastCell === cell) {
          // 本次位置有队员 && 上次选择是2首发队员 && 位置相同时
          // 1.清理队员
          this.positionDelPlayer(row, cell);
          // 2.队员列表添加本次队员
          this.lstPlayerAdd(fifa);
        } else {
          // 1.上次位置添加本次队员
          this.positionDelPlayer(lastRow, lastCell);
          this.positionAddPlayer(lastRow, lastCell, fifa);
          // 2.本次位置添加上次队员
          this.positionDelPlayer(row, cell);
          this.positionAddPlayer(row, cell, lastFifa);
        }
        // 3.清理上次选择
        this.clearSelect();
      } else {
        // 本次位置有队员 && 上次0没有选择
        // 遍历位置，设置位置能力
        squadlist.forEach(row => {
          row.lstCell.forEach(cell => {
            cell.value = fifa.positionRating[cell.name];
          });
        });
        // 1.记录本次选择
        this.setData({
          squadlist: squadlist,
          selRow: row,
          selCell: cell,
          lastSelect: 2,  // 上次选择对象 0没有选择，1候补队员，2首发队员
          fifa: fifa
        })
      }
    } else {
      // 本次位置没队员
      if (lastSelect === 1) {
        // 本次位置没队员 && 上次选择是1候补队员
        // 1.本次位置添加上次队员
        this.positionAddPlayer(row, cell, lastFifa);
        // 2.队员列表移除上次队员
        this.lstPlayerDel(this.data.fifa.player._id);
        // 3.清空上次选择
        this.clearSelect();
      } else if (lastSelect === 2) {
        // 本次位置没队员 && 上次选择是2首发队员
        // 1.本次位置添加上次队员
        this.positionAddPlayer(row, cell, lastFifa);
        // 2.上次位置清除队员
        this.positionDelPlayer(lastRow, lastCell);
        // 3.清空上次选择
        this.clearSelect();
      }
    }
    wx.hideLoading();
  },

  // 位置清除队员
  positionDelPlayer(row, cell) {
    let lineuplist = this.data.formation.lineuplist;
    let squadlist = this.data.squadlist;
    // 重设当前阵容人数
    const positionName = squadlist[row].lstCell[cell].name;
    for (let index = 0; index < lineuplist.length; index++) {
      if (lineuplist[index].position === positionName) {
        lineuplist.splice(index, 1);
      }
    }
    delete squadlist[row].lstCell[cell].fifa;
    this.setData({
      [`lstTab[0].count`]: '' + lineuplist.length,
      [`formation.lineuplist`]: lineuplist,
      squadlist: squadlist
    })
  },

  // 位置添加队员
  positionAddPlayer(row, cell, fifa) {
    let squadlist = this.data.squadlist;
    let lineuplist = this.data.formation.lineuplist;
    // 重设当前阵容人数
    const positionName = squadlist[row].lstCell[cell].name;
    lineuplist.push({ playerid: fifa.player._id, position: positionName });
    squadlist[row].lstCell[cell].fifa = fifa;
    squadlist[row].lstCell[cell].rating = fifa.positionRating[positionName];
    this.setData({
      squadlist: squadlist,
      lineuplist: lineuplist,
      [`lstTab[0].count`]: '' + lineuplist.length,
      [`formation.quarterlist`]: squadlist
    })
  },

  // 列表添加队员
  lstPlayerAdd(fifa) {
    let fifalist = this.data.sofifa.fifalist;
    fifalist.unshift(fifa);
    this.setData({
      [`sofifa.fifalist`]: fifalist,
      [`lstTab[1].count`]: '' + fifalist.length
    })
  },

  // 列表清除队员
  lstPlayerDel(playerid) {
    let fifalist = this.data.sofifa.fifalist;
    for (let index = 0; index < fifalist.length; index++) {
      const fifa = fifalist[index];
      if (fifa.player._id === playerid) {
        fifalist.splice(index, 1);
        break;
      }
    }
    this.setData({
      [`sofifa.fifalist`]: fifalist,
      [`lstTab[1].count`]: '' + fifalist.length
    })
  },

  // 清除选中
  clearSelect() {
    this.setData({
      lastSelect: 0,
      selRow: -1,
      selCell: -1,
      fifa: null
    })
  },
  
  // 全清按钮点击事件
  bindClearClick: function (e) {
    let squadlist = this.data.squadlist;
    let fifalist = this.data.sofifa.fifalist;
    let fifa = {};
    // 遍历位置
    squadlist.forEach(row => {
      row.lstCell.forEach(cell => {
        fifa = cell.fifa;
        if (fifa) {
          // 列表添加队员
          fifalist.unshift(fifa);
          // 位置清除队员
          delete cell.fifa;
        }
      });
    });
    this.setData({
      [`lstTab[0].count`]: '0',
      [`lstTab[1].count`]: '' + fifalist.length,
      [`sofifa.fifalist`]: fifalist,
      [`formation.lineuplist`]: [],
      squadlist: squadlist
    })
    this.clearSelect();
  },

  // 确定按钮点击事件
  submitForm() {
    // 获取首页的playerid
    let pages = getCurrentPages();
    let indexPage = pages[0];
    let playerid = indexPage.data.loginPlayer._id;
    let formation = this.data.formation;
    if (formation._id) {
      // 更新阵容
      wx.showLoading({
        title: '',
        mask: true
      })
      formation.updater = playerid;
      wx.cloud.callFunction({
        name: 'yun',
        data: {
          controller: 'formation',
          action: 'update',
          data: formation
        }
      }).then(res => {
        // 正确的执行结果
        console.log('更新阵容成功', res);
        this.setData({
          dialogShow: true
        })
        wx.hideLoading();
      }).catch(err => {
        // 错误的执行结果
        console.log('更新阵容失败', err);
        wx.hideLoading();
      })
    } else {
      // 新增阵容
      wx.showLoading({
        title: '',
        mask: true
      })
      formation.creater = playerid;
      wx.cloud.callFunction({
        name: 'yun',
        data: {
          controller: 'formation',
          action: 'add',
          data: formation
        }
      }).then(res => {
        // 正确的执行结果
        console.log('添加阵容成功', res);
        this.setData({
          dialogShow: true
        })
        wx.hideLoading();
      }).catch(err => {
        // 错误的执行结果
        console.log('添加阵容失败', err);
        wx.hideLoading();
      })
    }
  },

  // 保存成功弹窗按钮点击事件
  tapDialogButton(e) {
    // 返回前1个页面
    wx.navigateBack({
      delta: 1
    })
  }
})