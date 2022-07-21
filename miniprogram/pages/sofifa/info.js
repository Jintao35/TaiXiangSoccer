const app = getApp();
Page({
  data: {
    tabIndex: 0,
    lstTab: [
      { title: '属性' },
      { title: '位置' },
      { title: '特性' }
    ],
    error: '',
    info: '',
    dialogShow: false,
    addFlag: true,
    buttons: [{ text: '确定' }],
    cboPlayerIndex: 0,
    cboPositionIndex: 0,
    cboPlayer: [],
    cboPosition: [
      { name: 'ST 前锋', value: 'ST', },
      { name: 'LW 左边锋', value: 'LW' },
      { name: 'CAM 前腰', value: 'CAM' },
      { name: 'RW 右边锋', value: 'RW' },
      { name: 'LM 左边前卫', value: 'LM' },
      { name: 'CM 中前卫', value: 'CM' },
      { name: 'RM 右边前卫', value: 'RM' },
      { name: 'LWB 左边翼卫', value: 'LWB' },
      { name: 'CDM 后腰', value: 'CDM' },
      { name: 'RWB 右边翼卫', value: 'RWB' },
      { name: 'LB 左边后卫', value: 'LB' },
      { name: 'CB 中后卫', value: 'CB' },
      { name: 'RB 右边后卫', value: 'RB' },
      { name: 'GK 守门员', value: 'GK' }
    ],
    fifa: {
      playerid: '',
      player: { no: 0, name: '请选择队员', pic: app.data.emptyPic, strBirthday: '2000-01-01', height: 180, weight: 70 },
      position: 'ST',
      bestPosition: '',
      weakFoot: 3,
      skillMoves: 3,
      attWorkRate: '中',
      defWorkRate: '中',
      overallRating: 50,
      bestOverallRating: 50,
      potential: 50,
      pacSprintSpeed: 50,
      pacAcceleration: 50,
      shoFinishing: 50,
      shoPositioning: 50,
      shoShotPower: 50,
      shoLongShots: 50,
      shoPenalties: 50,
      shoVolleys: 50,
      pasVision: 50,
      pasCrossing: 50,
      pasFKAccuracy: 50,
      pasLongPassing: 50,
      pasShortPassing: 50,
      pasCurve: 50,
      driAgility: 50,
      driBalance: 50,
      driReactions: 50,
      driComposure: 50,
      driBallControl: 50,
      driDribbling: 50,
      defInterceptions: 50,
      defHeading: 50,
      defMarking: 50,
      defStandingTackle: 50,
      defSlidingTackle: 50,
      phyJumping: 50,
      phyStamina: 50,
      phyStrength: 50,
      phyAggression: 50,
      gkDiving: 20,
      gkHandling: 20,
      gkKicking: 20,
      gkPositioning: 20,
      gkReflexes: 20,
      sho: 50,
      pas: 50,
      dri: 50,
      def: 50,
      phy: 50,
      pac: 50,
      positionRating: {
        ST: 50, CF: 50, LW: 50, CAM: 50, RW: 50, LM: 50, CM: 50, RM: 50, LWB: 50, CDM: 50, RWB: 50, LB: 50, CB: 50, RB: 50, GK: 50
      },
      traitlist: []
    },
    pickerIndex: [1, 1],
    numIndex: [0, 0],
    lstNum: [[9, 8, 7, 6, 5, 4, 3, 2], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]],
    lstWorkRate: ['高', '中', '低'],
    lstSquad: [
      {
        rowIndex: 0, lstCell: [
          { cellIndex: 0, name: 'LS', rating: 50, msg: '前锋=4%加速+5%速度+5%强壮+8%反应+13%跑位+10%控球+7%盘带+18%射术+10%头球+5%短传+10%射门力量+3%远射+2%凌空' },
          { cellIndex: 1, name: 'ST', rating: 50, msg: '前锋=4%加速+5%速度+5%强壮+8%反应+13%跑位+10%控球+7%盘带+18%射术+10%头球+5%短传+10%射门力量+3%远射+2%凌空' },
          { cellIndex: 2, name: 'RS', rating: 50, msg: '前锋=4%加速+5%速度+5%强壮+8%反应+13%跑位+10%控球+7%盘带+18%射术+10%头球+5%短传+10%射门力量+3%远射+2%凌空' }
        ]
      }, {
        rowIndex: 1, lstCell: [
          { cellIndex: 0, name: 'LW', rating: 50, msg: '边锋=7%加速+6%速度+3%敏捷+7%反应+9%跑位+6%视野+14%控球+9%传中+16%盘带+10%射术+9%短传+4%远射' },
          { cellIndex: 1, name: 'LAM', rating: 50, msg: '前腰=4%加速+3%速度+3%敏捷+7%反应+9%跑位+14%视野+15%控球+13%盘带+7%射术+4%长传+16%短传+5%远射' },
          { cellIndex: 2, name: 'CAM', rating: 50, msg: '前腰=4%加速+3%速度+3%敏捷+7%反应+9%跑位+14%视野+15%控球+13%盘带+7%射术+4%长传+16%短传+5%远射' },
          { cellIndex: 3, name: 'RAM', rating: 50, msg: '前腰=4%加速+3%速度+3%敏捷+7%反应+9%跑位+14%视野+15%控球+13%盘带+7%射术+4%长传+16%短传+5%远射' },
          { cellIndex: 4, name: 'RW', rating: 50, msg: '边锋=7%加速+6%速度+3%敏捷+7%反应+9%跑位+6%视野+14%控球+9%传中+16%盘带+10%射术+9%短传+4%远射' }
        ]
      }, {
        rowIndex: 2, lstCell: [
          { cellIndex: 0, name: 'LM', rating: 50, msg: '边前卫=7%加速+6%速度+5%体能+7%反应+8%跑位+7%视野+13%控球+10%传中+15%盘带+6%射术+5%长传+11%短传' },
          { cellIndex: 1, name: 'LCM', rating: 50, msg: '中前卫=6%体能+8%反应+5%拦截意识+6%跑位+13%视野+14%控球+7%盘带+2%射术+13%长传+17%短传+4%远射+5%抢断' },
          { cellIndex: 2, name: 'CM', rating: 50, msg: '中前卫=6%体能+8%反应+5%拦截意识+6%跑位+13%视野+14%控球+7%盘带+2%射术+13%长传+17%短传+4%远射+5%抢断' },
          { cellIndex: 3, name: 'RCM', rating: 50, msg: '中前卫=6%体能+8%反应+5%拦截意识+6%跑位+13%视野+14%控球+7%盘带+2%射术+13%长传+17%短传+4%远射+5%抢断' },
          { cellIndex: 4, name: 'RM', rating: 50, msg: '边前卫=7%加速+6%速度+5%体能+7%反应+8%跑位+7%视野+13%控球+10%传中+15%盘带+6%射术+5%长传+11%短传' }
        ]
      }, {
        rowIndex: 3, lstCell: [
          { cellIndex: 0, name: 'LWB', rating: 50, msg: '边翼卫=4%加速+6%速度+10%体能+8%反应+12%拦截意识+8%控球+12%传中+4%盘带+10%短传+7%防守意识+8%抢断+11%铲球' },
          { cellIndex: 1, name: 'LDM', rating: 50, msg: '后腰=6%体能+4%强壮+7%反应+5%侵略性+14%拦截意识+4%视野+10%控球+10%长传+14%短传+9%防守意识+12%抢断+5%铲球' },
          { cellIndex: 2, name: 'CDM', rating: 50, msg: '后腰=6%体能+4%强壮+7%反应+5%侵略性+14%拦截意识+4%视野+10%控球+10%长传+14%短传+9%防守意识+12%抢断+5%铲球' },
          { cellIndex: 3, name: 'RDM', rating: 50, msg: '后腰=6%体能+4%强壮+7%反应+5%侵略性+14%拦截意识+4%视野+10%控球+10%长传+14%短传+9%防守意识+12%抢断+5%铲球' },
          { cellIndex: 4, name: 'RWB', rating: 50, msg: '边翼卫=4%加速+6%速度+10%体能+8%反应+12%拦截意识+8%控球+12%传中+4%盘带+10%短传+7%防守意识+8%抢断+11%铲球' }
        ]
      }, {
        rowIndex: 4, lstCell: [
          { cellIndex: 0, name: 'LB', rating: 50, msg: '边后卫=5%加速+7%速度+8%体能+8%反应+12%拦截意识+7%控球+9%传中+4%头球+7%短传+8%防守意识+11%抢断+14%铲球' },
          { cellIndex: 1, name: 'LCB', rating: 50, msg: '中后卫=2%速度+3%弹跳+10%强壮+5%反应+7%侵略性+13%拦截意识+4%控球+10%头球+5%短传+14%防守意识+17%抢断+10%铲球' },
          { cellIndex: 2, name: 'CB', rating: 50, msg: '中后卫=2%速度+3%弹跳+10%强壮+5%反应+7%侵略性+13%拦截意识+4%控球+10%头球+5%短传+14%防守意识+17%抢断+10%铲球' },
          { cellIndex: 3, name: 'RCB', rating: 50, msg: '中后卫=2%速度+3%弹跳+10%强壮+5%反应+7%侵略性+13%拦截意识+4%控球+10%头球+5%短传+14%防守意识+17%抢断+10%铲球' },
          { cellIndex: 4, name: 'RB', rating: 50, msg: '边后卫=5%加速+7%速度+8%体能+8%反应+12%拦截意识+7%控球+9%传中+4%头球+7%短传+8%防守意识+11%抢断+14%铲球' }
        ]
      }, {
        rowIndex: 5, lstCell: [
          { cellIndex: 0, name: 'GK', rating: 50, msg: '门将=11%反应+21%鱼跃+21%手型+05%开球+21%站位+21%门将反应' }
        ]
      }
    ],
    chklsTrait: [
      { name: '大力界外球', value: '1', memo: '为您的界外球增加额外的距离。' },
      { name: '大力任意球', value: '2', memo: '使您能够踢出低平任意球。' },
      { name: '玻璃人', value: '3', memo: '具有这种特质的玩家在碰撞发生时受伤的几率会增加。' },
      { name: '防守核心', value: '4', memo: '具有此特性的玩家在碰撞发生时受伤的几率降低。' },
      { name: '倒地铲球(AI)', value: '5', memo: '具有此特性的 CPU AI 球员将更有可能使用滑铲，而不是抢断。' },
      { name: '领导能力', value: '6', memo: '激励球队中的其他球员发挥出最高水平。' },
      { name: '擅长45度斜传', value: '7', memo: '为边路的前点传球增加弧度。' },
      { name: '推射', value: '8', memo: '增加您在球门前的脚侧面触球效果。' },
      { name: '天赋', value: '9', memo: '增加脚后跟传球和花式第一脚触球的可能性。' },
      { name: '长传制导(AI)', value: '10', memo: '具有此特性的 CPU AI 球员有这个特点更可能尝试长传。' },
      { name: '远程重炮(AI)', value: '11', memo: '具有此特性的 CPU AI 球员在带球跑动时更可能尝试远射，也更可能尝试远射。' },
      { name: '快速盘带高手(AI)', value: '12', memo: '具有此特性的 CPU AI 球员将更有可能长途奔袭或尝试折线盘带。' },
      { name: '组织核心(AI)', value: '13', memo: '用您出色的进攻组织能力成为进攻的焦点。' },
      { name: '长距离手抛球(GK)', value: '14', memo: '增加过肩抛球的距离。' },
      { name: '强力头球', value: '15', memo: '在攻门时增加额外的头球力道。' },
      { name: '大力手抛球', value: '16', memo: '让您可以将界外球直接掷入禁区。' },
      { name: '外脚背射门', value: '17', memo: '使您能够用外脚背踢出弧线球。' },
      { name: '绝对忠诚', value: '18', memo: '当被指定的队长不在阵容中或在比赛中因替补或红牌而被除名时，与领导层和团队成员一起作为决策过程的一部分。众所周知，具有这种特质的球员会忠于他们目前的俱乐部，这将在职业生涯模式中推动故事情节的发展。' },
      { name: '团队球员', value: '19', memo: '尝试让队友参与进攻以提高进攻表现。' },
      { name: '吊射(AI)', value: '20', memo: '即使守门员刚刚偏离底线，他也会试图把球击穿。' },
      { name: '技术型盘带选手(AI)', value: '21', memo: '具有此特性的 CPU AI 球员有这个特点将更有可能去长跑或尝试锯齿形运球。具有此特性的 CPU AI 球员有这个特点将更有可能被称为一个短角球的支持球员。' },
      { name: '弃门出击(GK)', value: '22', memo: '具有此特性的守门员在出禁区时会更具侵略性，在顶上或长传球时。（守门员高出击倾向）' },
      { name: '注意传中球(GK)', value: '23', memo: '具有此特性的守门员只会在他们认为自己可以在对手之前到达球的时候试图拦截传中。（对高空球不轻易拦截）' },
      { name: '出击破坏传中(GK)', value: '24', memo: '具有此特性的守门员会试图拦截传中，即使他们认为自己能在对手之前拿到球。（对高空球习惯性拦截）' },
      { name: '用脚扑救(GK)', value: '25', memo: '具有此特性的守门员通常会选择用脚救球，这使得守门员在近距离射门时的救球频率略高于不具有“用脚扑球”特性的守门员。' }
    ],

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '',
      mask: true
    })
    // 获取首页
    const pages = getCurrentPages();
    const indexPage = pages[0];
    // 获取上一个页面
    const prevPage = pages[pages.length - 2];
    // 调用父页面的Data
    let fifa = {};
    const updater = indexPage.data.loginPlayer._id;
    if (options.playerid) {
      // 更新队员
      fifa = JSON.parse(JSON.stringify(prevPage.data.fifa));
      fifa.updater = updater;
      fifa.playerid = options.playerid;
      fifa.index = prevPage.data.fifa.player.index;
      let cboPositionIndex = 0;
      const cboPosition = this.data.cboPosition;
      const position = app.searchByParam(cboPosition, 'value', fifa.position);
      if (position) {
        cboPositionIndex = cboPosition.indexOf(position);
      }
      this.setData({
        addFlag: false,
        cboPositionIndex: cboPositionIndex,
        fifa: fifa
      })
    } else {
      // 新增队员
      fifa = this.data.fifa;
      fifa.updater = updater;
      // 获取首页的现役队员列表
      const cboPlayer = JSON.parse(JSON.stringify(indexPage.data.lstAllPlayer));
      // 调用父页面的Data
      const fifalist = JSON.parse(JSON.stringify(prevPage.data.sofifa.fifalist));
      // 移除sofifa中已存在的队员
      for (let index = 0; index < cboPlayer.length; index++) {
        const player = cboPlayer[index];
        if (app.searchByParam(fifalist, 'playerid', player._id)) {
          cboPlayer.splice(index, 1);
          index--;
        }
      }
      cboPlayer.unshift({ _id: "", name: '请选择队员', pic: app.data.emptyPic, birthday: new Date('2000-01-01'), height: 180, weight: 70 });
      this.setData({
        cboPlayer: cboPlayer,
        fifa: fifa
      })
    }
    // 初始化特性
    this.initTrait(fifa.traitlist);
    // 初始化擅长位置
    this.initSquad(fifa.positionRating);
    wx.hideLoading();
  },
  // 初始化特性
  initTrait(value) {
    let chklsTrait = this.data.chklsTrait;
    chklsTrait.forEach(trait => {
      if (value.indexOf(trait.value) > -1) {
        trait.checked = true;
      }
    });
    this.setData({
      chklsTrait: chklsTrait
    })
  },
  // 初始化擅长位置
  initSquad(positionRating) {
    let lstSquad = this.data.lstSquad;
    lstSquad[0].lstCell[0].rating = positionRating.ST;
    lstSquad[0].lstCell[1].rating = positionRating.ST;
    lstSquad[0].lstCell[2].rating = positionRating.ST;
    lstSquad[1].lstCell[0].rating = positionRating.LW;
    lstSquad[1].lstCell[1].rating = positionRating.CAM;
    lstSquad[1].lstCell[2].rating = positionRating.CAM;
    lstSquad[1].lstCell[3].rating = positionRating.CAM;
    lstSquad[1].lstCell[4].rating = positionRating.RW;
    lstSquad[2].lstCell[0].rating = positionRating.LM;
    lstSquad[2].lstCell[1].rating = positionRating.CM;
    lstSquad[2].lstCell[2].rating = positionRating.CM;
    lstSquad[2].lstCell[3].rating = positionRating.CM;
    lstSquad[2].lstCell[4].rating = positionRating.RM;
    lstSquad[3].lstCell[0].rating = positionRating.LWB;
    lstSquad[3].lstCell[1].rating = positionRating.CDM;
    lstSquad[3].lstCell[2].rating = positionRating.CDM;
    lstSquad[3].lstCell[3].rating = positionRating.CDM;
    lstSquad[3].lstCell[4].rating = positionRating.RWB;
    lstSquad[4].lstCell[0].rating = positionRating.LB;
    lstSquad[4].lstCell[1].rating = positionRating.CB;
    lstSquad[4].lstCell[2].rating = positionRating.CB;
    lstSquad[4].lstCell[3].rating = positionRating.CB;
    lstSquad[4].lstCell[4].rating = positionRating.RB;
    lstSquad[5].lstCell[0].rating = positionRating.GK;
    this.setData({
      lstSquad: lstSquad
    })
  },
  // 计算位置得分
  getPositionRating() {
    let fifa = this.data.fifa;
    let lstSquad = this.data.lstSquad;
    // LS ST RS = Math.round(4%加速+5%速度+5%强壮+8%反应+13%跑位+10%控球+7%盘带+18%射术+10%头球+5%短传+10%射门力量+3%远射+2%凌空)
    const stRating = Math.round(0.04 * fifa.pacAcceleration + 0.05 * fifa.pacSprintSpeed + 0.05 * fifa.phyStrength + 0.08 * fifa.driReactions + 0.13 * fifa.shoPositioning + 0.10 * fifa.driBallControl + 0.07 * fifa.driDribbling + 0.18 * fifa.shoFinishing + 0.10 * fifa.defHeading + 0.05 * fifa.pasShortPassing + 0.10 * fifa.shoShotPower + 0.03 * fifa.shoLongShots + 0.02 * fifa.shoVolleys);
    lstSquad[0].lstCell[0].rating = stRating;
    lstSquad[0].lstCell[1].rating = stRating;
    lstSquad[0].lstCell[2].rating = stRating;
    // CF LF RF = Math.round(5%加速+5%速度+9%反应+13%跑位+8%视野+15%控球+14%盘带+11%射术+2%头球+9%短传+5%射门力量+4%远射)
    // 没有
    // CAM LAM RAM = Math.round(4%加速+3%速度+3%敏捷+7%反应+9%跑位+14%视野+15%控球+13%盘带+7%射术+4%长传+16%短传+5%远射)
    const camRating = Math.round(0.04 * fifa.pacAcceleration + 0.03 * fifa.pacSprintSpeed + 0.03 * fifa.driAgility + 0.07 * fifa.driReactions + 0.09 * fifa.shoPositioning + 0.14 * fifa.pasVision + 0.15 * fifa.driBallControl + 0.13 * fifa.driDribbling + 0.07 * fifa.shoFinishing + 0.04 * fifa.pasLongPassing + 0.16 * fifa.pasShortPassing + 0.05 * fifa.shoLongShots);
    lstSquad[1].lstCell[1].rating = camRating;
    lstSquad[1].lstCell[2].rating = camRating;
    lstSquad[1].lstCell[3].rating = camRating;
    // LW RW = Math.round(7%加速+6%速度+3%敏捷+7%反应+9%跑位+6%视野+14%控球+9%传中+16%盘带+10%射术+9%短传+4%远射)
    const rwRating = Math.round(0.07 * fifa.pacAcceleration + 0.06 * fifa.pacSprintSpeed + 0.03 * fifa.driAgility + 0.07 * fifa.driReactions + 0.09 * fifa.shoPositioning + 0.06 * fifa.pasVision + 0.14 * fifa.driBallControl + 0.09 * fifa.pasCrossing + 0.16 * fifa.driDribbling + 0.10 * fifa.shoFinishing + 0.09 * fifa.pasShortPassing + 0.04 * fifa.shoLongShots);
    lstSquad[1].lstCell[0].rating = rwRating;
    lstSquad[1].lstCell[4].rating = rwRating;
    // CM LCM RCM = Math.round(6%体能+8%反应+5%拦截意识+6%跑位+13%视野+14%控球+7%盘带+2%射术+13%长传+17%短传+4%远射+5%抢断)
    const cmRating = Math.round(0.06 * fifa.phyStamina + 0.08 * fifa.driReactions + 0.05 * fifa.defInterceptions + 0.06 * fifa.shoPositioning + 0.13 * fifa.pasVision + 0.14 * fifa.driBallControl + 0.07 * fifa.driDribbling + 0.02 * fifa.shoFinishing + 0.13 * fifa.pasLongPassing + 0.17 * fifa.pasShortPassing + 0.04 * fifa.shoLongShots + 0.05 * fifa.defStandingTackle);
    lstSquad[2].lstCell[1].rating = cmRating;
    lstSquad[2].lstCell[2].rating = cmRating;
    lstSquad[2].lstCell[3].rating = cmRating;
    // LM RM = Math.round(7%加速+6%速度+5%体能+7%反应+8%跑位+7%视野+13%控球+10%传中+15%盘带+6%射术+5%长传+11%短传)
    const rmRating = Math.round(0.07 * fifa.pacAcceleration + 0.06 * fifa.pacSprintSpeed + 0.05 * fifa.phyStamina + 0.07 * fifa.driReactions + 0.08 * fifa.shoPositioning + 0.07 * fifa.pasVision + 0.13 * fifa.driBallControl + 0.10 * fifa.pasCrossing + 0.15 * fifa.driDribbling + 0.06 * fifa.shoFinishing + 0.05 * fifa.pasLongPassing + 0.11 * fifa.pasShortPassing);
    lstSquad[2].lstCell[0].rating = rmRating;
    lstSquad[2].lstCell[4].rating = rmRating;
    // CDM LDM RDM = Math.round(6%体能+4%强壮+7%反应+5%侵略性+14%拦截意识+4%视野+10%控球+10%长传+14%短传+9%防守意识+12%抢断+5%铲球)
    const cdmRating = Math.round(0.06 * fifa.phyStamina + 0.04 * fifa.phyStrength + 0.07 * fifa.driReactions + 0.05 * fifa.phyAggression + 0.14 * fifa.defInterceptions + 0.04 * fifa.pasVision + 0.10 * fifa.driBallControl + 0.10 * fifa.pasLongPassing + 0.14 * fifa.pasShortPassing + 0.09 * fifa.defMarking + 0.12 * fifa.defStandingTackle + 0.05 * fifa.defSlidingTackle);
    lstSquad[3].lstCell[1].rating = cdmRating;
    lstSquad[3].lstCell[2].rating = cdmRating;
    lstSquad[3].lstCell[3].rating = cdmRating;
    // LWB RWB = Math.round(4%加速+6%速度+10%体能+8%反应+12%拦截意识+8%控球+12%传中+4%盘带+10%短传+7%防守意识+8%抢断+11%铲球)
    const rwbRating = Math.round(0.04 * fifa.pacAcceleration + 0.06 * fifa.pacSprintSpeed + 0.10 * fifa.phyStamina + 0.08 * fifa.driReactions + 0.12 * fifa.defInterceptions + 0.08 * fifa.driBallControl + 0.12 * fifa.pasCrossing + 0.04 * fifa.driDribbling + 0.10 * fifa.pasShortPassing + 0.07 * fifa.defMarking + 0.08 * fifa.defStandingTackle + 0.11 * fifa.defSlidingTackle);
    lstSquad[3].lstCell[0].rating = rwbRating;
    lstSquad[3].lstCell[4].rating = rwbRating;
    // CB LCB RCB = Math.round(2%速度+3%弹跳+10%强壮+5%反应+7%侵略性+13%拦截意识+4%控球+10%头球+5%短传+14%防守意识+17%抢断+10%铲球)
    const cbRating = Math.round(0.02 * fifa.pacSprintSpeed + 0.03 * fifa.phyJumping + 0.10 * fifa.phyStrength + 0.05 * fifa.driReactions + 0.07 * fifa.phyAggression + 0.13 * fifa.defInterceptions + 0.04 * fifa.driBallControl + 0.10 * fifa.defHeading + 0.05 * fifa.pasShortPassing + 0.14 * fifa.defMarking + 0.17 * fifa.defStandingTackle + 0.10 * fifa.defSlidingTackle);
    lstSquad[4].lstCell[1].rating = cbRating;
    lstSquad[4].lstCell[2].rating = cbRating;
    lstSquad[4].lstCell[3].rating = cbRating;
    // LB RB = Math.round(5%加速+7%速度+8%体能+8%反应+12%拦截意识+7%控球+9%传中+4%头球+7%短传+8%防守意识+11%抢断+14%铲球)
    const rbRating = Math.round(0.05 * fifa.pacAcceleration + 0.07 * fifa.pacSprintSpeed + 0.08 * fifa.phyStamina + 0.08 * fifa.driReactions + 0.12 * fifa.defInterceptions + 0.07 * fifa.driBallControl + 0.09 * fifa.pasCrossing + 0.04 * fifa.defHeading + 0.07 * fifa.pasShortPassing + 0.08 * fifa.defMarking + 0.11 * fifa.defStandingTackle + 0.14 * fifa.defSlidingTackle);
    lstSquad[4].lstCell[0].rating = rbRating;
    lstSquad[4].lstCell[4].rating = rbRating;
    // GK = Math.round(11%反应+21%鱼跃+21%手型+5%开球+21%站位+21%门将反应)
    const gkRating = Math.round(0.11 * fifa.driReactions + 0.21 * fifa.gkDiving + 0.21 * fifa.gkHandling + 0.05 * fifa.gkKicking + 0.21 * fifa.gkPositioning + 0.21 * fifa.gkReflexes);
    lstSquad[5].lstCell[0].rating = gkRating;
    // 综合能力
    fifa.positionRating.LS = stRating;
    fifa.positionRating.ST = stRating;
    fifa.positionRating.RS = stRating;
    fifa.positionRating.LW = rwRating;
    fifa.positionRating.LAM = camRating;
    fifa.positionRating.CAM = camRating;
    fifa.positionRating.RAM = camRating;
    fifa.positionRating.RW = rwRating;
    fifa.positionRating.LM = rmRating;
    fifa.positionRating.LCM = cmRating;
    fifa.positionRating.CM = cmRating;
    fifa.positionRating.RCM = cmRating;
    fifa.positionRating.RM = rmRating;
    fifa.positionRating.LWB = rwbRating;
    fifa.positionRating.LDM = cdmRating;
    fifa.positionRating.CDM = cdmRating;
    fifa.positionRating.RDM = cdmRating;
    fifa.positionRating.RWB = rwbRating;
    fifa.positionRating.LB = rbRating;
    fifa.positionRating.LCB = cbRating;
    fifa.positionRating.CB = cbRating;
    fifa.positionRating.RCB = cbRating;
    fifa.positionRating.RB = rbRating;
    fifa.positionRating.GK = gkRating;
    const overallRating = fifa.positionRating[fifa.position];
    this.setData({
      lstSquad: lstSquad,
      [`fifa.overallRating`]: overallRating,
      [`fifa.positionRating`]: fifa.positionRating
    })
  },
  // 导航栏切换
  bindSwitchTab: function (e) {
    const tabIndex = e.detail.index;
    this.setData({
      tabIndex: tabIndex
    })
  },
  // 队员选择事件
  bindPlayerChange: function (e) {
    const index = e.detail.value;
    const player = this.data.cboPlayer[index];
    player.strBirthday = app.formatDate(player.birthday, 'yyyy-MM-dd');
    let fifa = this.data.fifa;
    fifa.playerid = player._id;
    fifa.index = player.index;
    fifa.player = player;
    this.setData({
      cboPlayerIndex: index,
      fifa: fifa
    })
  },
  // 位置选择事件
  bindPositionChange: function (e) {
    const index = e.detail.value;
    const position = this.data.cboPosition[index].value;
    const fifa = this.data.fifa;
    const overallRating = fifa.positionRating[position];
    this.setData({
      cboPositionIndex: index,
      [`fifa.position`]: position,
      [`fifa.overallRating`]: overallRating
    })
  },
  // 进攻积极性、防守积极性下拉框选择事件
  bindWorkRatePickerChange: function (e) {
    this.setData({
      [`fifa.` + e.currentTarget.dataset.field]: this.data.lstWorkRate[Number(e.detail.value)]
    })
  },
  // 逆足能力、花式技巧点击事件
  bindStarClick: function (e) {
    this.setData({
      [`fifa.` + e.currentTarget.dataset.field]: Number(e.currentTarget.dataset.value)
    })
  },
  // 六维点击事件
  bindSixClick: function (e) {
    const msg = e.currentTarget.dataset.msg;
    // 特性描述
    this.setData({
      info: msg
    })
  },
  // 位置点击事件
  bindSquadClick: function (e) {
    const rowIndex = e.currentTarget.dataset.row;
    const cellIndex = e.currentTarget.dataset.cell;
    const cell = this.data.lstSquad[rowIndex].lstCell[cellIndex];
    const msg = cell.msg;
    // 位置描述
    this.setData({
      info: msg
    })
  },
  // 数值点击事件
  bindNumPickerClick: function (e) {
    const msg = e.currentTarget.dataset.msg;
    // 位置描述
    this.setData({
      info: msg
    })
    let num = this.data.fifa[e.currentTarget.dataset.field];
    if (num < 20) {
      this.setData({
        numIndex: [0, this.data.lstNum[1].indexOf(num % 10)]
      })
    } else {
      this.setData({
        numIndex: [this.data.lstNum[0].indexOf(Math.trunc(num / 10)), this.data.lstNum[1].indexOf(num % 10)]
      })
    }
  },
  // 数值下拉框选择事件
  bindNumPickerChange: function (e) {
    let field = e.currentTarget.dataset.field;
    let fifa = this.data.fifa;
    let value = this.data.lstNum[0][e.detail.value[0]] * 10 + this.data.lstNum[1][e.detail.value[1]];
    this.setData({
      [`fifa.` + field]: value
    })
    if ('potential' === field) {
      // 修改潜力不会改变六维和位置得分
      return;
    }
    // 计算六维
    let six = field.substring(0, 3);
    switch (six) {
      case "sho":
        // 射门 = 45%射术 + 5%跑位 + 20%射门力量 + 20%远射 + 5%点球 + 5%凌空
        let sho = Math.round(0.45 * fifa.shoFinishing + 0.05 * fifa.shoPositioning + 0.20 * fifa.shoShotPower
          + 0.20 * fifa.shoLongShots + 0.05 * fifa.shoPenalties + 0.05 * fifa.shoVolleys);
        this.setData({
          [`fifa.sho`]: sho
        })
        break;
      case "pas":
        // 传球 = 20%视野 + 20%传中 + 5%任意球精度 + 15%长传 + 35%短传 + 5%弧线
        let pas = Math.round(0.20 * fifa.pasVision + 0.20 * fifa.pasCrossing + 0.05 * fifa.pasFKAccuracy
          + 0.15 * fifa.pasLongPassing + 0.35 * fifa.pasShortPassing + 0.05 * fifa.pasCurve);
        this.setData({
          [`fifa.pas`]: pas
        })
        break;
      case "dri":
        // 盘带 = 10%敏捷 + 5%平衡 + 5%反应 + 0%沉着 + 30%控球 + 50%盘带
        let dri = Math.round(0.10 * fifa.driAgility + 0.05 * fifa.driBalance + 0.05 * fifa.driReactions
          + 0.30 * fifa.driBallControl + 0.50 * fifa.driDribbling);
        this.setData({
          [`fifa.dri`]: dri
        })
        break;
      case "def":
        // 防守 = 20%拦截意识 + 10%头球精度 + 30%防守意识 + 30%抢断 + 10%铲球
        let def = Math.round(0.20 * fifa.defInterceptions + 0.10 * fifa.defHeading + 0.30 * fifa.defMarking
          + 0.30 * fifa.defStandingTackle + 0.10 * fifa.defSlidingTackle);
        this.setData({
          [`fifa.def`]: def
        })
        break;
      case "phy":
        // 力量 = 5%弹跳 + 25%体能 + 50%强壮 + 20%侵略性
        let phy = Math.round(0.05 * fifa.phyJumping + 0.25 * fifa.phyStamina + 0.50 * fifa.phyStrength + 0.20 * fifa.phyAggression);
        this.setData({
          [`fifa.phy`]: phy
        })
        break;
      case "pac":
        // 速度 = 55%速度 + 45%加速
        let pac = Math.round(0.55 * fifa.pacSprintSpeed + 0.45 * fifa.pacAcceleration);
        this.setData({
          [`fifa.pac`]: pac
        })
        break;
      default:
        break;
    }
    this.getPositionRating();
  },
  // 特性选择事件
  bindTraitChange: function (e) {
    let chklsTrait = this.data.chklsTrait;
    let selValues = e.detail.value;
    let traitlist = [];
    // 数组减数组，得到新增加的特性
    let infoTrait = selValues.filter((i) => !traitlist.includes(i));
    chklsTrait.forEach(trait => {
      trait.checked = false;
      if (selValues.indexOf(trait.value) > -1) {
        trait.checked = true;
        traitlist.push(trait.value);
      }
    });
    if (infoTrait.length > 0) {
      // 特性描述
      this.setData({
        info: chklsTrait[infoTrait[0] - 1].memo
      })
    }
    this.setData({
      chklsTrait: chklsTrait,
      [`fifa.traitlist`]: traitlist
    });
  },
  // 保存
  submitForm() {
    wx.showLoading();
    const addFlag = this.data.addFlag;
    const fifa = this.data.fifa;
    // 获取上一个页面信息
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    let fifalist = prevPage.data.sofifa.fifalist;
    if (addFlag === true) {
      if (this.data.cboPlayerIndex == 0) {
        this.setData({
          error: "请选择队员"
        })
        wx.hideLoading();
        return false;
      }
      // 新增队员
      wx.cloud.callFunction({
        name: 'yun',
        data: {
          controller: 'sofifa',
          action: 'addPlayer',
          data: fifa
        }
      }).then(res => {
        console.log('新增队员成功', res);
        // 上一页的列表增加新队员
        fifalist.unshift(fifa);
        prevPage.setData({
          [`sofifa.fifalist`]: fifalist,
        })
        this.setData({
          dialogShow: true
        })
        wx.hideLoading();
      }).catch(err => {
        console.log('新增队员失败', err);
        wx.hideLoading();
      })
    } else {
      // 更新队员，先移除后新增
      wx.cloud.callFunction({
        name: 'yun',
        data: {
          controller: 'sofifa',
          action: 'deletePlayer',
          data: {
            playerid: fifa.playerid
          }
        }
      }).then(res => {
        console.log('移除队员成功', res);
        // 上一页的列表移除队员
        for (let index = 0; index < fifalist.length; index++) {
          const oldFifa = fifalist[index];
          if (oldFifa.playerid === fifa.playerid) {
            fifalist.splice(index, 1);
            break;
          }
        }
        this.setData({
          [`sofifa.fifalist`]: fifalist,
        })
        // 新增队员
        wx.cloud.callFunction({
          name: 'yun',
          data: {
            controller: 'sofifa',
            action: 'addPlayer',
            data: fifa
          }
        }).then(res => {
          console.log('新增队员成功', res);
          // 上一页的列表增加新队员
          fifalist.unshift(fifa);
          prevPage.setData({
            [`sofifa.fifalist`]: fifalist,
          })
          this.setData({
            dialogShow: true
          })
        }).catch(err => {
          console.log('新增队员失败', err);
          wx.hideLoading();
        })
        wx.hideLoading();
      }).catch(err => {
        console.log('移除队员失败', err);
        wx.hideLoading();
      })
    }
  },
  // 保存成功弹窗按钮点击事件
  tapDialogButton(e) {
    wx.navigateBack({
      delta: 1
    })
  }
});