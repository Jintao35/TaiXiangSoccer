const app = getApp();

Page({

  /**
    * 页面的初始数据
    */
  data: {
    // 深绿、浅绿、黄、橙、红
    lstColor: [
      'rgba(12, 133, 57, 1)',
      'rgba(102, 168, 15, 1)',
      'rgba(230, 182, 0, 1)',
      'rgba(217, 92, 15, 1)',
      'rgba(201, 42, 42, 1)'
    ],
    radar: {
      lstTitle: ['传球', '盘带', '防守', '力量', '速度', '射门'],
      width: 160,
      height: 160,
      hornCount: 6, // 角的数量
      center: 100, // 中心点，width / 2
      radius: 60, // 半径(减去的值用于给绘制的文本留空间)，center - 60
      angle: Math.PI * 2 / 6 // 角度，Math.PI * 2 / hornCount
    },

    fifa1: {},
    fifa2: {
      attWorkRate: "中",
      bestOverallRating: 50,
      bestPosition: "",
      def: 50,
      defHeading: 50,
      defInterceptions: 50,
      defMarking: 50,
      defSlidingTackle: 50,
      defStandingTackle: 50,
      defWorkRate: "中",
      dri: 50,
      driAgility: 50,
      driBalance: 50,
      driBallControl: 50,
      driComposure: 50,
      driDribbling: 50,
      driReactions: 50,
      gkDiving: 50,
      gkHandling: 50,
      gkKicking: 50,
      gkPositioning: 50,
      gkReflexes: 50,
      index: 0,
      overallRating: 50,
      pac: 50,
      pacAcceleration: 50,
      pacSprintSpeed: 50,
      pas: 50,
      pasCrossing: 50,
      pasCurve: 50,
      pasFKAccuracy: 50,
      pasLongPassing: 50,
      pasShortPassing: 50,
      pasVision: 50,
      phy: 50,
      phyAggression: 50,
      phyJumping: 50,
      phyStamina: 50,
      phyStrength: 50,
      player: {
        height: "185",
        index: 0,
        name: "请选择队员",
        no: "0",
        pic: "https://wx4.sinaimg.cn/large/008nJrvKly1guqn64wsydg601o01ot8h02.gif",
        strBirthday: "1990-01-01",
        weight: "80",
        bmi: 20.00,
        _id: "a0000000000000000000000000000000",
      },
      playerid: "a0000000000000000000000000000000",
      position: "CM",
      potential: 50,
      sho: 50,
      shoFinishing: 50,
      shoLongShots: 50,
      shoPenalties: 50,
      shoPositioning: 50,
      shoShotPower: 50,
      shoVolleys: 50,
      skillMoves: 3,
      traitlist: [],
      weakFoot: 3
    },
  },

  /**
    * 生命周期函数--监听页面初次渲染完成
    */
  onLoad: function (options) {
    wx.showLoading({
      title: '',
      mask: true
    })

    const pages = getCurrentPages();
    // 获取首页
    const indexPage = pages[0];
    // 获取上一个页面
    const prevPage = pages[pages.length - 2];
    // 调用父页面的Data
    let fifa = {};
    fifa = JSON.parse(JSON.stringify(prevPage.data.fifa));
    fifa.playerid = options.playerid;
    fifa.index = prevPage.data.fifa.player.index;
    let num = fifa.player.weight / (fifa.player.height * fifa.player.height / 10000);
    fifa.player.bmi = num.toFixed(2);
    // 获取首页的现役队员列表
    const cboPlayer = JSON.parse(JSON.stringify(indexPage.data.lstAllPlayer));
    // 调用父页面的Data
    const fifalist = JSON.parse(JSON.stringify(prevPage.data.sofifa.fifalist));
    // 移除sofifa中不存在的队员
    for (let index = 0; index < cboPlayer.length; index++) {
      const player = cboPlayer[index];
      if (!app.searchByParam(fifalist, 'playerid', player._id)) {
        cboPlayer.splice(index, 1);
        index--;
      }
    }
    this.setData({
      cboPlayer: cboPlayer,
      fifa1: fifa
    })
    // 绘制雷达图
    this.drawRadar(fifa, null);
    wx.hideLoading();
  },

  // 绘制雷达图
  drawRadar: function (fifa1, fifa2) {
    const query = wx.createSelectorQuery()
    query.select('#radarCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        // 清除图像重新绘制
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr); // 缩放当前绘图至更大或更小
        const lstRegion = [
          { value: [100, 100, 100, 100, 100, 100], color: 'rgba(96, 96, 96, 1)' },
          { value: [80, 80, 80, 80, 80, 80], color: 'rgba(144, 144, 144, 1)' },
          { value: [60, 60, 60, 60, 60, 60], color: 'rgba(96, 96, 96, 1)' },
          { value: [40, 40, 40, 40, 40, 40], color: 'rgba(144, 144, 144, 1)' },
          { value: [20, 20, 20, 20, 20, 20], color: 'rgba(96, 96, 96, 1)' }
        ]

        // // 绘制蜘蛛网线路
        // const radar = this.data.radar;
        // ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // 设置或返回用于笔触的颜色、渐变或模式
        // ctx.lineWidth = 1;  // 设置或返回当前的线条宽度
        // ctx.lineCap = "round"; // 设置或返回线条的结束端点样式
        // for (var i = 0; i < radar.hornCount; i++) {
        //   var x = radar.center + radar.radius * Math.cos(radar.angle * i);
        //   var y = radar.center + radar.radius * Math.sin(radar.angle * i);
        //   ctx.moveTo(radar.center, radar.center);
        //   ctx.lineTo(x, y);
        // }
        // ctx.stroke(); // 绘制已定义的路径

        // 绘制背景
        lstRegion.forEach(region => {
          this.drawRegion(ctx, region.value, null, region.color);
        });

        // 绘制文字
        this.drawTextCans(ctx, 'rgba(0, 0, 0, 1)');
        // 绘制队员
        if (fifa1) {
          this.drawRegion(ctx, [fifa1.pas, fifa1.dri, fifa1.def, fifa1.phy, fifa1.pac, fifa1.sho], 'rgba(96, 224, 256, 0.9)', 'rgba(96, 224, 256, 0.5)');
        }
        if (fifa2) {
          this.drawRegion(ctx, [fifa2.pas, fifa2.dri, fifa2.def, fifa2.phy, fifa2.pac, fifa2.sho], 'rgba(256, 160, 224, 0.9)', 'rgba(256, 160, 224, 0.5)');
        }
      })
  },

  // 绘制背景
  drawRegion: function (ctx, lstValue, lineColor, bgColor) {
    const radar = this.data.radar;
    if (lineColor) {
      ctx.strokeStyle = lineColor; // 设置或返回用于笔触的颜色、渐变或模式
      ctx.lineWidth = 1;  // 设置或返回当前的线条宽度
      ctx.lineCap = "round"; // 设置或返回线条的结束端点样式
    }
    ctx.beginPath();
    for (var i = 0; i < radar.hornCount; i++) {
      var x = radar.center + radar.radius * Math.cos(radar.angle * i) * lstValue[i] / 100;
      var y = radar.center + radar.radius * Math.sin(radar.angle * i) * lstValue[i] / 100;
      ctx.lineTo(x, y); // 添加一个新点，然后在画布中创建从该点到最后指定点的线条
    }
    ctx.closePath(); // 创建从当前点回到起始点的路径
    if (lineColor) {
      ctx.stroke(); // 绘制已定义的路径
    }
    if (bgColor) {
      ctx.fillStyle = bgColor; // 设置或返回用于填充绘画的颜色、渐变或模式
      ctx.fill(); // 填充当前绘图（路径）
    }
  },
  // 绘制文字
  drawTextCans: function (ctx, color) {
    const radar = this.data.radar;
    ctx.font = '900 16px serif' // 设置或返回文本内容的当前字体属性
    for (var i = 0; i < radar.hornCount; i++) {
      var x = radar.center + radar.radius * Math.cos(radar.angle * i);
      var y = radar.center + radar.radius * Math.sin(radar.angle * i);
      ctx.fillStyle = color; // 设置或返回用于填充绘画的颜色、渐变或模式
      // 通过不同的位置，调整文本的显示位置
      if (radar.angle * i >= 0 && radar.angle * i <= Math.PI / 2) {
        // 传球、盘带
        ctx.fillText(radar.lstTitle[i], x, y + 5);
      } else if (radar.angle * i > Math.PI / 2 && radar.angle * i <= Math.PI) {
        // 力量、防守
        ctx.fillText(radar.lstTitle[i], x - ctx.measureText(radar.lstTitle[i]).width, y + 5);
      } else if (radar.angle * i > Math.PI && radar.angle * i <= Math.PI * 3 / 2) {
        // 速度
        ctx.fillText(radar.lstTitle[i], x - ctx.measureText(radar.lstTitle[i]).width, y + 5);
      } else {
        // 射门
        ctx.fillText(radar.lstTitle[i], x, y + 5);
      }
    }
  },

  // 队员选择事件1
  bindPlayerChange1: function (e) {
    const index = e.detail.value;
    const player = this.data.cboPlayer[index];
    const pages = getCurrentPages();
    // 获取上一个页面
    const prevPage = pages[pages.length - 2];
    // 调用父页面的Data
    let fifalist = JSON.parse(JSON.stringify(prevPage.data.sofifa.fifalist));
    let fifa = app.searchByParam(fifalist, 'playerid', player._id);
    let num = fifa.player.weight / (fifa.player.height * fifa.player.height / 10000);
    fifa.player.bmi = num.toFixed(2);
    this.setData({
      cboPlayerIndex1: index,
      fifa1: fifa
    })
    // 绘制雷达图
    this.drawRadar(fifa, this.data.fifa2);
  },

  // 队员选择事件2
  bindPlayerChange2: function (e) {
    const index = e.detail.value;
    const player = this.data.cboPlayer[index];
    const pages = getCurrentPages();
    // 获取上一个页面
    const prevPage = pages[pages.length - 2];
    // 调用父页面的Data
    let fifalist = JSON.parse(JSON.stringify(prevPage.data.sofifa.fifalist));
    let fifa = app.searchByParam(fifalist, 'playerid', player._id);
    let num = fifa.player.weight / (fifa.player.height * fifa.player.height / 10000);
    fifa.player.bmi = num.toFixed(2);
    this.setData({
      cboPlayerIndex2: index,
      fifa2: fifa
    })
    // 绘制雷达图
    this.drawRadar(this.data.fifa1, fifa);
  },

})