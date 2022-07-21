// pages/match/setting.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    matchid: '',
    playerid: '',
    tabIndex: 0,
    lstTab: [
      { title: '第1节', count: '0' },
      { title: '第2节', count: '0' },
      { title: '第3节', count: '0' },
      { title: '第4节', count: '0' }
    ],
    cboPlayer: [
      { name: '-其它-', value: 0 },
      { name: '11人制', value: 11 },
      { name: '10人制', value: 10 },
      { name: '9人制', value: 9 },
      { name: '8人制', value: 8 },
      { name: '7人制', value: 7 }
    ],
    cboDefend: [{ name: '-自定义-', vlaue: 0 }],
    cboSquad: ['-自定义-'],
    pkrValue: [0, 0, 0],
    quarterlist: [
      { people: 0, squadlist: app.data.lstSquad, lineuplist: [] },
      { people: 0, squadlist: app.data.lstSquad, lineuplist: [] },
      { people: 0, squadlist: app.data.lstSquad, lineuplist: [] },
      { people: 0, squadlist: app.data.lstSquad, lineuplist: [] }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      matchid: options.matchid
    })
    this.bindReset();
  },

  // 重置按钮点击事件
  bindReset() {
    let matchid = this.data.matchid;
    // 获取上一个页面，比赛列表页面的比赛信息
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let lstMatch = prevPage.data.lstMatch;
    let match = app.searchByParam(lstMatch, '_id', matchid);
    if (match.quarterlist) {
      // 设置过阵容
      let lstTab = [];
      for (let index = 0; index < match.quarterlist.length; index++) {
        lstTab.push({ title: '第' + (index + 1) + '节', count: '' + match.quarterlist[index].people });
      }
      this.setData({
        lstTab: lstTab,
        quarterlist: match.quarterlist
      })
    } else {
      // 未设置过阵容
      const tabIndex = this.data.tabIndex;
      let lstTab = this.data.lstTab;
      let pkrValue = [0, 0, 0];
      if (match.man === 11) {
        // 11人制默认4-2-3-1阵型
        this.setDefendAndSquadByMan(1);
        this.setSquadByManAndDefend(1, 2);
        this.drawSquad(8);
        pkrValue = [1, 2, 8];
        lstTab[tabIndex].count = '11';
      } else if (match.man === 10) {
        // 10人制默认3-2-3-1阵型
        this.setDefendAndSquadByMan(2);
        this.setSquadByManAndDefend(2, 1);
        this.drawSquad(4);
        pkrValue = [2, 1, 4];
        lstTab[tabIndex].count = '10';
      } else {
        // 其它默认自定义阵型
        this.setDefendAndSquadByMan(12 - match.man);
      }
      this.setData({
        lstTab: lstTab,
        pkrValue: pkrValue,
        [`quarterlist[0].people`]: match.man
      })
    }
  },

  // 根据比赛人数选项初始化后卫人数和阵型
  setDefendAndSquadByMan(manIndex) {
    let man = this.data.cboPlayer[manIndex].value;    // 比赛最大人数
    let setDefend = [];                               // 后卫人数Set集合
    let cboDefend = [{ name: '-自定义-', vlaue: 0 }]; // 后卫人数选项集合
    let cboSquad = ['-自定义-'];                      // 阵型选项集合
    // 当场地人数改变时，重新给后卫人数选项集合赋值
    let lstAllSquad = app.getSquadListByMan(man);
    lstAllSquad.forEach(squad => {
      if (setDefend.indexOf(squad.defenders) < 0) {
        // 当set中不存在后卫人数时，将后卫人数添加到选项集合中
        setDefend.push(squad.defenders);
        cboDefend.push({ name: squad.defenders + '后卫', value: squad.defenders });
      }
    });
    this.setData({
      cboDefend: cboDefend,
      cboSquad: cboSquad
    })
  },
  // 根据比赛人数选项和后卫人数选项初始化阵型
  setSquadByManAndDefend(manIndex, defendIndex) {
    let man = this.data.cboPlayer[manIndex].value;      // 比赛最大人数
    let defend = this.data.cboDefend[defendIndex].value;// 后卫人数
    let lstAllSquad = [];                               // 阵型列表
    let cboSquad = ['-自定义-'];                        // 阵型选项集合
    lstAllSquad = app.getSquadListByManAndDefend(man, defend);
    lstAllSquad.forEach(item => {
      cboSquad.push(item.name);
    });
    this.setData({
      cboSquad: cboSquad
    })
  },
  // 导航栏切换
  bindSwitchTab: function (e) {
    const tabIndex = e.detail.index;
    this.setData({
      tabIndex: tabIndex
    })
  },
  // 选择阵型事件
  bindPickerChange: function (e) {
    if (e._userTap === false) {
      return false;
    }
    const tabIndex = this.data.tabIndex;
    const pkrValue = this.data.pkrValue;
    let quarterlist = this.data.quarterlist;
    let lstIndex = e.detail.value;              // 当前选中下标集合
    const manIndex = lstIndex[0];               // 比赛最大人数下标
    let defendIndex = lstIndex[1];              // 后卫人数下标
    let squadIndex = lstIndex[2];               // 阵型下标
    if (manIndex !== pkrValue[0]) {
      // 当比赛最大人数改变时，重新给后卫人数选项集合和阵型选项集合赋值
      this.setDefendAndSquadByMan(manIndex);
      // 重置下标
      defendIndex = 0;
      squadIndex = 0;
    } else if (defendIndex !== pkrValue[1]) {
      // 当后卫人数改变时，重新给阵型选项集合赋值
      this.setSquadByManAndDefend(manIndex, defendIndex);
      // 重置下标
      squadIndex = 0;
    }
    this.setData({
      pkrValue: [manIndex, defendIndex, squadIndex]
    })
    if (defendIndex > 0 && squadIndex > 0) {
      this.drawSquad(squadIndex);
    }
    // 设置tab页下标
    let people = 0;
    let lstPosition = quarterlist[tabIndex].squadlist;
    lstPosition.forEach(row => {
      row.lstCell.forEach(cell => {
        if (cell.checked) {
          people++;
        }
      });
    });
    let lstTab = this.data.lstTab;
    lstTab[tabIndex].count = '' + people;
    quarterlist[tabIndex].people = people;
    this.setData({
      lstTab: lstTab,
      quarterlist: quarterlist
    })
  },

  // 渲染阵型样式
  drawSquad(squadIndex) {
    const cboSquad = this.data.cboSquad;// 阵型列表
    let squadName = cboSquad[squadIndex];
    let squad = app.getSquadBySquadName(squadName);
    let squadPosition = squad.lstPosition;
    const tabIndex = this.data.tabIndex;
    let lstPosition = this.data.quarterlist[tabIndex].squadlist;
    lstPosition.forEach(row => {
      row.lstCell.forEach(cell => {
        if (squadPosition.indexOf(cell.name) > -1) {
          cell.checked = true;
        } else {
          cell.checked = false;
        }
      });
    });
    let quarterlist = this.data.quarterlist;
    quarterlist[this.data.tabIndex].squadlist = lstPosition;
    this.setData({
      quarterlist: quarterlist
    })
  },
  // 位置点击事件
  bindPositionClick(e) {
    const tabIndex = this.data.tabIndex;
    let lstClass = this.data.quarterlist;
    let lstSquad = lstClass[tabIndex].squadlist;
    let people = 0;
    let peopleIndex = 0;
    const rowIndex = e.currentTarget.dataset.row;
    const cellIndex = e.currentTarget.dataset.cell;
    const cell = lstSquad[rowIndex].lstCell[cellIndex];
    // 设置样式
    if (cell.checked === true) {
      cell.checked = false;
      cell.class = "";
    } else {
      cell.checked = true;
      cell.class = "check";
    }
    lstSquad.forEach(row => {
      row.lstCell.forEach(cell => {
        if (cell.checked === true) {
          ++people;
        }
      });
    });
    // 设置tab页下标
    let lstTab = this.data.lstTab;
    lstClass[tabIndex].people = people;
    lstTab[tabIndex].count = '' + people;
    // 计算场上人数
    if (people > 11 || people < 7) {
      peopleIndex = 0;
    } else {
      peopleIndex = 12 - people;
    }
    lstClass[tabIndex].squadindex = [peopleIndex, 0, 0];
    this.setData({
      lstTab: lstTab,
      pkrValue: [peopleIndex, 0, 0],
      quarterlist: lstClass
    })
  },

  // 添加节按钮点击事件
  bindAddClass() {
    let lstTab = this.data.lstTab;
    if (lstTab.length === 4) {
      return false;
    }
    lstTab.push({ title: '第' + (lstTab.length + 1) + '节', count: lstTab[0].count });
    let lstClass = this.data.quarterlist;
    let lstSquad = JSON.parse(JSON.stringify(this.data.quarterlist[0].squadlist));
    // 清除阵型中的队员
    lstSquad.forEach(row => {
      row.lstCell.forEach(cell => {
        cell.picked = false;
        cell.player = {};
      })
    });
    lstClass.push({ people: this.data.quarterlist[0].people, squadlist: lstSquad, lineuplist: [] });
    this.setData({
      lstTab: lstTab,
      quarterlist: lstClass
    })
  },

  // 删除节按钮点击事件
  bindDelClass() {
    let lstTab = this.data.lstTab;
    if (lstTab.length === 1) {
      return false;
    }
    const tabIndex = this.data.tabIndex;
    let lstClass = this.data.quarterlist;
    if (lstTab.length === tabIndex + 1) {
      // tabIndex在最后一页时，改为上一页
      this.setData({
        tabIndex: tabIndex - 1
      })
    }
    lstTab.splice(this.data.lstTab.length - 1, 1);
    lstClass.splice(this.data.lstTab.length, 1);
    this.setData({
      lstTab: lstTab,
      quarterlist: lstClass
    })
  },

  // 确定按钮点击事件
  submitForm() {
    let quarterlist = this.data.quarterlist;
    let lstTab = this.data.lstTab;
    if (quarterlist[0].people === 0) {
      return false;
    }
    for (let index = quarterlist.length - 1; index > 0; index--) {
      if (quarterlist[index].people === 0) {
        lstTab.splice(index, 1);
        quarterlist.splice(index, 1);
      }
    }
    // 清理未选中位置的队员
    quarterlist.forEach(squad => {
      squad.squadlist.forEach(row => {
        row.lstCell.forEach(cell => {
          if (cell.checked === false && cell.picked === true) {
            for (let index = 0; index < squad.lineuplist.length; index++) {
              const lineup = squad.lineuplist[index];
              if (lineup.playerid === cell.player._id)
              squad.lineuplist.splice(index, 1);
              break;
            }
            cell.picked = false;
            delete cell.player;
          }
        })
      });
    });
    this.setData({
      lstTab: lstTab,
      quarterlist: quarterlist
    })
    // 跳转到5_2阵容安排页面
    let url = `../squad/list?matchid=` + this.data.matchid;
    wx.navigateTo({
      url: url,
    })
  }
})