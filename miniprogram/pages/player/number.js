
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lstExisting: [],
    lstEmpty: [],
    tabIndex: 0,
    lstTab: [
      { title: '可选号码', count: '' },
      { title: '已有号码', count: '' }
    ],
    rowIndex: 0,
    cellIndex: 0,
    no: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let lstEmpty = [];
    let lstPlayer = [];
    let lstExistNo = [];
    let lstExisting = [];
    // 获取队员管理页面的现役球员列表
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 3];
    const lstActivePlayer = prevPage.data.lstActivePlayer;
    // 已有号码集合，纯数字数组
    lstActivePlayer.forEach(player => {
      if (player.no) {
        lstExistNo.push(player.no);
        lstPlayer.push(player);
      }
    });
    // 根据号码排序
    lstPlayer.sort(function (a, b) {
      return a.no - b.no;
    });
    const length = lstPlayer.length;
    const rows = Math.ceil(length / 3);
    for (let index = 0; index < rows; index++) {
      const value = lstPlayer[index].no + '.' + lstPlayer[index].name;
      const index1 = index + rows;
      const value1 = index1 < length ? lstPlayer[index1].no + '.' + lstPlayer[index1].name : '-';
      const index2 = index1 + rows;
      const value2 = index2 < length ? lstPlayer[index2].no + '.' + lstPlayer[index2].name : '-';
      lstExisting.push({
        cell: value,
        cell1: value1,
        cell2: value2
      });
    }
    // 可选号码集合
    let lstCell = [];
    for (let index = 1; index < 100; index++) {
      if (lstCell.length === 7) {
        // 每行7个号码
        lstEmpty.push(lstCell);
        lstCell = [];
      }
      if (lstExistNo.indexOf(index + '') === -1) {
        // 不重复时放入可选号码列表
        lstCell.push({ no: index, row: lstEmpty.length, cell: lstCell.length });
      }
    }
    lstEmpty.push(lstCell);
    this.setData({
      lstExisting: lstExisting,
      lstEmpty: lstEmpty
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
  bindClick(e) {
    // 恢复上次选中样式
    const oldRowIndex = this.data.rowIndex;
    const oldCellIndex = this.data.cellIndex;
    this.cellChecked(oldRowIndex, oldCellIndex, false);
    // 设置本次选中样式
    const rowIndex = e.currentTarget.dataset.row;
    const cellIndex = e.currentTarget.dataset.cell;
    this.cellChecked(rowIndex, cellIndex, true);
  },

  // 设置单元格选中样式
  cellChecked(rowIndex, cellIndex, checked) {
    let lstEmpty = this.data.lstEmpty;
    let cell = lstEmpty[rowIndex][cellIndex];
    cell.checked = checked;
    if (checked) {
      this.setData({
        rowIndex: rowIndex,
        cellIndex: cellIndex,
        no: cell.no + '',
        [`lstEmpty[` + rowIndex + `][` + cellIndex + `]`]: cell
      })
    } else {
      this.setData({
        [`lstEmpty[` + rowIndex + `][` + cellIndex + `]`]: cell
      })
    }
  },

  // 返回
  bindBack() {
    // 返回前1个页面
    wx.navigateBack({
      delta: 1
    })
  },
  // 确定
  bindOk() {
    const no = this.data.no;
    if (no) {
      // 获取队员信息页面
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        [`player.no`]: no
      })
    }
    this.bindBack();
  }
})