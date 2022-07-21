const app = getApp();
Page({
  data: {
    tabIndex: 0,
    error: '',
    info: '',
    officialInterpretation: '',
    folkInterpretation: '',
    sortField: '',
    buttons: [{ text: '确定' }],
    showPlayerDialog: false,
    showDescriptionDialog: false,
    lstTab: [
      // { title: '综合', count: '' },
      { title: '队员列表', count: '' },
      { title: '批量修改', count: '' },
      // { title: '特性列表', count: '' }
    ],
    showActionsheet: false,
    actionSheetTitle: '',
    lstButton: [
      { text: '个人能力', value: 0 },
      { text: '数据对比', value: 1 },
      { text: '增加队员', value: 2 },
      { text: '修改数据', value: 3 },
      { text: '移除队员', value: 4 }
    ],
    modifyField: 'shoFinishing',
    // modifyFieldName: '射术',
    sofifa: {},
    fifa: {},
    numIndex: [0, 0],
    lstNum: [[9, 8, 7, 6, 5, 4, 3, 2], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]],
    lstField: [
      {
        name: '射门', child: [
          { name: '射术', value: 'shoFinishing', officialInterpretation: '优秀的临门一脚会提高您在禁区内面对守门员时的射门成功率。', folkInterpretation: '临门一脚是球员在禁区内用脚射门的精度。并不是所有人都知道，但实际临门一脚完全不影响球员头球射门的精度，也不影响任何在禁区外射门的精度。一个好的射手并不意味着每次都能够打败门将，只是把球射向球门范围会更容易。就像是临门一脚属性高的球员能够更好的影响球的轨迹。不怎么样的射手会把球打在门柱上，而好的射手会把球推进球门，或者把本来更难打的球压在门框范围甚至门柱上。' },
          { name: '跑位', value: 'shoPositioning', officialInterpretation: '排名越高，球被判出界时，您的球员就会自动站到越有利的位置。', folkInterpretation: '进攻位置是球员比赛时在球场上能够获取更好有利位置的能力。值越高，球员越会找到更好的更具威胁的位置去拿球。这个属性只影响球员在球场上找到好的位置去穿插去撕扯对方后防线，为进攻阵型创造有利条件，但却不影响球队主罚任意球或者角球时球员参与进攻的站位。' },
          { name: '射门力量', value: 'shoShotPower', officialInterpretation: '无论您的射门类型与距离如何，您的射门力道越大，您的射门就会越强劲。', folkInterpretation: '射门力量决定了球员射门时踢球的力度。但也是控制着球员大力射门后是否能保持精准的属性。任何距离的射门都受到影响，射门力量低的球员依然可以通过大力射门得分，但是你射门键按的蓄力越久，他就越容易miss。' },
          { name: '远射', value: 'shoLongShots', officialInterpretation: '远射能力越强，禁区外射门得分的几率越大。', folkInterpretation: '远射影响球员在禁区外射门的精度。是中场球员重要的属性。' },
          { name: '点球', value: 'shoPenalties', officialInterpretation: '较高的能力值能增加射进点球的成功率，不给守门员留下任何机会。', folkInterpretation: '球员十二码精准度。' },
          { name: '凌空', value: 'shoVolleys', officialInterpretation: '高评分能增加您凌空抽射进球得分的几率，让守门员无所适从。', folkInterpretation: '凌空能力是球员打凌空球的力量和精准度的衡量属性，它影响球员射空中球时的技巧和精准，外加转身射凌空球时的身体平衡能力。' }]
      },
      {
        name: '传球', child: [
          { name: '视野', value: 'pasVision', officialInterpretation: '视野会提升您的技巧以踢出准确并完美的直塞球，从而增加为队友助攻得分的几率。', folkInterpretation: '视野是球员观察到队友或者对手球员位置的能力属性，这个能力影响着球员远距离传球的成功率（提高或降低）当我们游戏时玩家看的是上帝视角，就像看比赛转播那样。然而球员在场上的视野是第一人称，这是非常难以看到队友在哪儿的，看不清队友位置的远距离传球，落点就会更随机。很可能就把球传给了对手。视野值越高，球员的视界就更广，就更容易锁定队友位置，远距离传球也会更准。球员的传球值哪怕再高，但视野不怎样，那也然并卵。' },
          { name: '传中', value: 'pasCrossing', officialInterpretation: '良好的传中属性可以提高您找到队友并避开对手的机会。', folkInterpretation: '这个属性同时影响了球员在跑动时传中和定位球传中的精准度。这是边路球员的基本能力，但同时也影响定位球，也决定你的传中球传至禁区的能力，如果你的边路球员下底传中经常被封堵，那很有可能是他的传中属性太差了。' },
          { name: '任意球', value: 'pasFKAccuracy', officialInterpretation: '较高的任意球精度会增加您在罚定位球时避开人墙并打破门将十指关的机会。', folkInterpretation: '用来判定任意球的精准，数值越高越有可能通过任意球直接得分。最合理的应是你选择弧度和FK精准度高的球员来罚球。' },
          { name: '长传', value: 'pasLongPassing', officialInterpretation: '提升您的长传能力，以更精确、更强有力的过顶传球转守为攻。', folkInterpretation: '这个数值界定了一个球员执行长传（空中球）的能力，并不影响长距离地面球。同时还决定了长传球的速度和精准，数值越高，球越快越准。' },
          { name: '短传', value: 'pasShortPassing', officialInterpretation: '短传能力越强，球员传球失误的几率越低。', folkInterpretation: '同长传，数值越高，球越快越准。' },
          { name: '弧线', value: 'pasCurve', officialInterpretation: '弧线评分越高，射门和横传时球的弧度和偏转程度就越高。', folkInterpretation: '被用来判定球员射门或者传球时球的弧度。值越高，球员踢球时的弧线程度越大。对于任何定位球来说这都是非常好的属性，弧线角球是后防线的噩梦，旋转更高的任意球也更难被扑救。' }]
      },
      {
        name: '盘带', child: [
          { name: '敏捷', value: 'driAgility', officialInterpretation: '敏捷性球员的转身速度更快，并且能够在比赛中做出大力头槌、凌空抽射和倒挂金钩这些动作。', folkInterpretation: '敏捷是用来衡量球员移动或转身时的灵活程度。换言之，也是球员可以多快多优雅的在场上拿球转圈。拥有高敏捷的球员可以上演杂技般的射门或者解围。敏捷同时还影响球员带球能力。如果你是喜欢带球的玩家，高敏捷是一个你需要重点关注的数值。' },
          { name: '平衡', value: 'driBalance', officialInterpretation: '良好的平衡评分将降低被对手挑战时失去平衡和跌倒的机会。', folkInterpretation: '平衡是球员在身体对抗后保持身体平衡的能力属性。这也是另一个影响球员带球技巧的属性，通俗来讲，这部分影响带球的就是球员响应的手感。如果你有高敏捷和平衡的球员，那你移动起来就如同泥鳅那样顺滑，能在对方重点关照之下进进出出。另外，如果你的球员拥有95+的加速度和冲刺速度，你的球员依然感觉笨重，响应起来跟个铁憨憨一样，那也是因为他受限于敏捷和平衡。' },
          { name: '反应', value: 'driReactions', officialInterpretation: '良好的反应能力可以让您抢得先机，比其他球员更快接近无人持有和弹回的球。', folkInterpretation: '反应能力是指球员在面对周遭情况时做出的响应的速度。这跟球员的速度没任何关系。一个球员的速度可以非常快但是同时他的反应很慢。反应的时间点就像，在他看见球在哪和他站好位置去接球的时刻之间，很多人以为反应属性只对于玩家控制的球员来说才重要，因为球员的反应取决于你的按键反应。但这是不对，在很多情况下，可能没切换到你要控制的球员，也可能换到了然后够不到球，当球员接球的时候并不需要一个很高的反应速度，他会照常接到传球。但是当球在混战中弹来弹去时，出现了一个能占上风的机会，举例说，在一场混抢之中球到处滚，有些球员只是能够碰到球，但是反应属性高的球员就会有更高的概率把这个球控下来哪怕情况很复杂。再比如，对手的守门员刚刚扑救了一次大力射门，球弹向了你，然后你猛按射门键，但是你的球员根本没做出动作来，他只是愣愣的去撞到了这个球，这就是因为你的球员没有足够高的反应去协调他的身体和双脚来准备好做出打门动作。反应属性同时还影响了带球，虽然它不会大幅影响球员的带球，让它变的很好或者很差，但它能够允许你的球员在面对对方上抢或者滑铲的时候做出正确的反应，尝试去赢回球。甚至能够让你的球员有能力去越过对手的抢断尝试。' },
          { name: '沉着', value: 'driComposure', officialInterpretation: '确定持球球员在什么距离开始感受到来自对手的压力，然后影响球员在射门、传球、传中等时出错的几率。', folkInterpretation: '这个属性决定了球员感受到对手的压迫时球与人之间的距离。沉着数值还影响着球员在射门，传球，传中时失误的概率。沉着值越高，球员面对来自对手的压力时，表现就越好。沉着属性对于大部分玩家来说并不是一个新的属性，它曾在多个FIFA版本中出现，且在去年回归了FIFA。' },
          { name: '控球', value: 'driBallControl', officialInterpretation: '您的控球越好，您的球员在接球时的更可能作出良好的第一脚触球。', folkInterpretation: '控球是一个球员接球时控制球的能力。值越高，就越不容易出现球员控球时，球离本尊越远的情况。这个属性同时还关联球员带球的舒适度，高控球球员就像是球绑在了脚上那样，根本不需要去看球，就知道球在哪儿。这对你球员的接球和带球都是一项重要的属性，包括那些无球晃动动作。这也影响当球员面对对手拦截时能够多好的去进行护球。' },
          { name: '盘带', value: 'driDribbling', officialInterpretation: '优秀的带球评分表示您的球员在高速奔跑时能更紧密地控制着足球。', folkInterpretation: '带球是球员带球前进和带球过人的能力。带球值越高意味球员带球时将会更好的保持球的位置，因为他需要尽可能的让球离自己更近，让对手更难从他脚上将球断走。带球属性是不影响球员接球能力的，那只和控球有关。但是一旦球到了你脚下并且你控住了球想盘过对手，那带球属性就起作用了。如果你喜欢带球，你的球员在这项属性上也需要尽可能的高。可是，好的盘带不一定意味着球员需要有更多颗星的花式技巧，你可以找到那些拥有4星或5星，但带球却很低的球员。花式技巧的星数只是简单定义了球员拿球做出技巧移动的要求，但还是为了突破，所以这两者拥有相似的目的（带球），它们却互不相关。事实当我们选4-5星花式的球员，不管你用不用花式，目标还是为了过人，所以选择球员光看他的花式技巧是不够的，如果你喜欢更具有技巧性的队伍，你同样需要关注带球，控球和平衡。' }]
      },
      {
        name: '防守', child: [
          { name: '拦截意识', value: 'defInterceptions', officialInterpretation: '切断对方传球的能力。', folkInterpretation: '拦截属性决定了球员阅读比赛的能力和拦截传球的能力。这项属性对AI控制的球员会更有用，如果你看到一个球员经常伸腿或者做一些出人意料的动作去拦截一个球，那就是他的拦截属性挺高的。' },
          { name: '头球精度', value: 'defHeading', officialInterpretation: '高头球精度能增加您在球门前时机的把握并提高精度。', folkInterpretation: '球员头球精准的程度，不论用头球摆渡是头球打门。事实上这个属性影响了2个方面，一个是你的球员是否有能力去顶到这个球，第二个是精准度。' },
          { name: '防守意识', value: 'defMarking', officialInterpretation: '增加您的盯人属性会强化在球队没有球权时您球员采取的默认站位。', folkInterpretation: '盯人是球员盯防对手的能力，换句话说，能让防守球员不是那么容易被甩掉，并且向对手进攻球员施压，不让他舒服或者干脆不让他把球传出去的能力，也影响球员的跟防。更多是在AI球员无球状态下的作用，当你控制防守球员时他们的盯防好坏也受到影响。' },
          { name: '抢断', value: 'defStandingTackle', officialInterpretation: '抢断值越高意味着下脚时拦下足球的成功率越高。', folkInterpretation: '这个属性意味着球员抢断的能力，时机的好坏，抢到球了，还是造成犯规。一个优秀的中后卫应该有很高的抢断&铲球属性，因为这些动作具有冒险性，很可能造成犯规、吃牌等等。但如果成功也会有效打断对手的进攻，使用得当效果甚佳。记住断球的定义就是：球员用身体的力量，上半身的碰撞，或者出脚顺利的抢球或者破坏，并且不犯规。在游戏里这些行为也可能表现为推挤一下对方，拉拽一下他的球衣，按一下对手，等等其他不怎么干净的动作，并且还不犯规，那说明你的球员抢断属性蛮高了。' },
          { name: '铲球', value: 'defSlidingTackle', officialInterpretation: '数值越高，滑铲成功的几率越大。', folkInterpretation: '这个属性意味着球员抢断的能力，时机的好坏，抢到球了，还是造成犯规。一个优秀的中后卫应该有很高的抢断&铲球属性，因为这些动作具有冒险性，很可能造成犯规、吃牌等等。但如果成功也会有效打断对手的进攻，使用得当效果甚佳。记住断球的定义就是：球员用身体的力量，上半身的碰撞，或者出脚顺利的抢球或者破坏，并且不犯规。在游戏里这些行为也可能表现为推挤一下对方，拉拽一下他的球衣，按一下对手，等等其他不怎么干净的动作，并且还不犯规，那说明你的球员抢断属性蛮高了。' }]
      },
      {
        name: '力量', child: [
          { name: '弹跳', value: 'phyJumping', officialInterpretation: '您跳的越高，就越有可能打败对手争得高空球。', folkInterpretation: '弹跳属性影响球员起跳的质量，值越高，跳的越高。对于有些球员来讲，这个属性在没有其他属性并行支撑的情况下实在是没啥用，举例来说一个球员的制空能力要强，那么他的弹跳，侵略性，力量，头球能力都需要很不错。显然球员的身高也可能会帮忙，身高压制的时候你就不需要那么高的弹跳了。' },
          { name: '体能', value: 'phyStamina', officialInterpretation: '耐力值高的球员在场上的冲刺时间更长，耐力恢复的速度更快。', folkInterpretation: '耐力属性是决定球员在场上什么时候会累的，是你的球员临近全场还是半场会踢不动的考量。千万别以为你的球员只有在场上捂着胸口喘气才是累的表现，当他到了这一步，那其实意味着他已经踢不动了。他的比赛表现早就在这之前已经受到了影响，耐力同时也是你球员在对抗中是否容易受伤的属性，不仅仅是在比赛最后阶段。这个属性也是定义了你球员恢复体力的快慢，以及你的球员能冲刺多久。' },
          { name: '强壮', value: 'phyStrength', officialInterpretation: '力量可以增加您与对手球员进行身体对抗时胜出的几率。', folkInterpretation: '力量有关乎球员身体对抗的能力，值越高，球员就更有可能从身体对抗中获益。你的球员力量属性将会决定他们在任何的身体对抗中的表现，所以对参与防守的球员来说这是非常重要的属性。同时对于锋线来讲，你也至少要在前场拥有一个力量属性高的球员，以此来保证你有机会和防守球员在对抗中55开。' },
          { name: '侵略性', value: 'phyAggression', officialInterpretation: '积极性会提升您在 50/50 争夺中获得球权的成功率。', folkInterpretation: '侵略性水平是球员做出侵略性抢断动作，铲断动作，推搡动作的频率。这决定了球员在场上的意志力和投入度。一个典型的侵略性动作就是当你在“肩对肩对抗”的过程中，高侵略性的友方球员会积极的去把对手撞开（他的力量能有多大，他就去撞多远），然后去获得对抗的胜利。侵略性另一个体现是争顶时，如果你踢球你就应该知道争顶就是你和对手的站位，身体上的比拼，如果能争到头球，最好，就算抢不到也要恶心一下对手不让他顶的顺利。在这种情况下，侵略性属性就要和力量，头球一起发挥作用了。高侵略性的球员在禁区里可能会做出冒险动作造成犯规，哪怕你压根没去按键。这会让你的游戏体验暴跌，所以选择高侵略性的中后卫也要小心。' }]
      },
      {
        name: '速度', child: [
          { name: '冲刺速度', value: 'pacSprintSpeed', officialInterpretation: '提升冲刺速度将对手远远甩开，全速冲刺时无人能敌。', folkInterpretation: '冲刺速度判定了一个球员能跑的最快上限。我们已经解释过“加速度”了，那冲刺速度是什么，不管怎样，如果你仍需要了解这两者的区别。这里有一个很好的例子。一个人，一辆车，一架飞机来一场比赛，谁能赢？这取决于，如果这场比赛只有30米那么远，那人会赢。因为他只需要4秒就能完成，然而赛道拉长，150-200米，那车会赢，如果更长如上千公里，那飞机就赢了。这是因为人的加速度高于车，车高于飞机。但是距离拉长的话，他自然垫底，因为人的冲刺速度也就那样。' },
          { name: '加速', value: 'pacAcceleration', officialInterpretation: '提高加速度将提高球员的起跑速度并缩短达到最大冲刺速度的时间。', folkInterpretation: '加速度就是球员奔跑速度的提升。球员值越高，达到最高冲刺速度的所需时间就越短，不论最高速度是多少。这需要与冲刺速度一起参考。假设当一个球员拥有高加速度但是低冲刺速度，在场上他正在加速，但由于他的最大冲刺速度比较低，所以在这种情况下，加速度就显得如同鸡肋--如果你的冲刺速度并不是很快，那你其实也不怎么需要很快的就到达这个速度最高点。另一方面，一个球员如果拥有高冲刺速度但是加速度却很低，那他还是可以跑的很快，只是他需要更长的时间去达到最高冲刺速度。' }]
      },
      {
        name: '守门', child: [
          { name: '鱼跃', value: 'gkDiving', officialInterpretation: '', folkInterpretation: '扑救是门将飞身扑救空中球的能力，这直接受到门将身高的影响。' },
          { name: '手形', value: 'gkHandling', officialInterpretation: '', folkInterpretation: '接球是门将独有的能力，用来定义门将是否能够干净的稳稳的抓住皮球。换言之，有多容易黄油手的属性。' },
          { name: '开球', value: 'gkKicking', officialInterpretation: '', folkInterpretation: '开球是门将另一个独有属性，这是门将开球门球的精度和力度。手抛球也受到开球属性一部分的影响，但主要还是由手抛球特质决定。' },
          { name: '站位', value: 'gkPositioning', officialInterpretation: '', folkInterpretation: '门将扑救时选择站位的能力，同时影响门将拦截传中球的能力。' },
          { name: '反应', value: 'gkReflexes', officialInterpretation: '', folkInterpretation: '反应是门将扑救时的敏捷度，换句话说这决定了门将能有多快速的做出扑救动作，如果这个属性很低，那他移动的也慢，来球扑救动作也慢。' }]
      },
    ],
    cboField: [['射门', '传球', '盘带', '防守', '力量', '速度', '守门'], ['射术', '跑位', '射门力量', '远射', '点球', '凌空']],
    lstPosition: ['ST', 'LW', 'RW', 'CAM', 'LM', 'RM', 'CM', 'CDM', 'LWB', 'RWB', 'LB', 'RB', 'CB', 'GK'],
    fieldIndex: [0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
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
      const updater = indexPage.data.loginPlayer._id;
      sofifa.updater = updater;
      // 获取首页的队员列表
      const lstAllPlayer = JSON.parse(JSON.stringify(indexPage.data.lstAllPlayer));
      sofifa.fifalist.forEach(fifa => {
        let player = app.searchByParam(lstAllPlayer, '_id', fifa.playerid);
        fifa.player = player;
        fifa.player.strBirthday = app.formatDate(player.birthday, 'yyyy-MM-dd');
      });
      this.setData({
        sofifa: sofifa
      })
      wx.hideLoading();
    }).catch(err => {
      console.log('获取队员能力信息失败', err);
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
    // 获取队员信息
    const fifa = e.currentTarget.dataset.item;
    let actionSheetTitle = fifa.player.no + '.' + fifa.player.name;
    this.setData({
      fifa: fifa,
      showActionsheet: true,
      actionSheetTitle: actionSheetTitle
    })
  },

  // 六维列表表头点击事件
  bindTheadClick: function (e) {
    // 根据字段、序号排序
    const field = e.currentTarget.dataset.field;
    const lstPosition = this.data.lstPosition;
    let sofifa = this.data.sofifa;
    sofifa.fifalist.sort(function (star, next) {
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

  // 属性列改变事件
  bindFieldPickerChange: function (e) {
    const value = e.detail.value;
    const field = this.data.lstField[value[0]].child[value[1]];
    // 改变属性时，清理修改前数据
    const oldField = this.data.modifyField;
    let sofifa = this.data.sofifa;
    if (field.value !== oldField) {
      sofifa.fifalist.forEach(fifa => {
        if (fifa.before) {
          fifa[oldField] = fifa.before;
          delete fifa.before;
        }
      });
    }
    // 根据属性值、序号排序
    sofifa.fifalist.sort(function (a, b) {
      return b[field.value] === a[field.value] ? a.index - b.index : b[field.value] - a[field.value];
    });
    this.setData({
      sortField: field,
      sofifa: sofifa,
      fieldIndex: value,
      modifyField: field.value,
      // modifyFieldName: field.name
    })
  },

  // 属性列控件选择事件
  bindFieldPickerColumnChange: function (e) {
    if (e.detail.column === 0) {
      // 改变第一列的值时动态生成第二列
      const value = e.detail.value;
      const lstField = this.data.lstField;
      const lstChildField = lstField[value].child;
      let lstOption = [];
      lstChildField.forEach(field => {
        lstOption.push(field.name);
      });
      this.setData({
        fieldIndex: [value, 0],
        [`cboField[1]`]: lstOption
      })
    }
  },

  // 数值点击事件
  bindNumPickerClick: function (e) {
    const playerid = e.currentTarget.dataset.playerid;
    this.data.sofifa.fifalist.forEach(fifa => {
      if (playerid === fifa.playerid) {
        const num = fifa[this.data.modifyField];
        if (num < 20) {
          this.setData({
            numIndex: [0, this.data.lstNum[1].indexOf(num % 10)]
          })
        } else {
          this.setData({
            numIndex: [this.data.lstNum[0].indexOf(Math.trunc(num / 10)), this.data.lstNum[1].indexOf(num % 10)]
          })
        }
        return;
      }
    });
  },

  // 数值下拉框选择事件
  bindNumPickerChange: function (e) {
    let value = this.data.lstNum[0][e.detail.value[0]] * 10 + this.data.lstNum[1][e.detail.value[1]];
    const playerid = e.currentTarget.dataset.playerid;
    let sofifa = this.data.sofifa;
    sofifa.fifalist.forEach(fifa => {
      if (playerid === fifa.playerid) {
        const field = this.data.modifyField;
        if (fifa.before) {
          if (fifa.before === value) {
            delete fifa.before;
          }
        } else {
          if (fifa[field] !== value) {
            fifa.before = fifa[field];
          }
        }
        fifa[field] = value;
        this.setData({
          sofifa: sofifa
        })
        return;
      }
    })
  },

  // 保存属性修改
  saveModifyField() {
    const field = this.data.modifyField;
    const lstFifa = this.data.sofifa.fifalist;
    let lstModify = [];
    lstFifa.forEach(fifa => {
      if (fifa.before) {
        lstModify.push({ playerid: fifa.playerid, value: fifa[field] });
      }
    });
    if (lstModify.length === 0) {
      this.setData({ error: '未修改任何数据' })
    }
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
      const updater = indexPage.data.loginPlayer._id;
      sofifa.updater = updater;
      sofifa.fifalist.forEach(fifa => {
        let modify = app.searchByParam(lstModify, 'playerid', fifa.playerid);
        if (modify) {
          fifa[field] = modify.value;
          // 计算六维
          let six = field.substring(0, 3);
          switch (six) {
            case "sho":
              // 射门 = 45%射术 + 5%跑位 + 20%射门力量 + 20%远射 + 5%点球 + 5%凌空
              let sho = Math.round(0.45 * fifa.shoFinishing + 0.05 * fifa.shoPositioning + 0.20 * fifa.shoShotPower
                + 0.20 * fifa.shoLongShots + 0.05 * fifa.shoPenalties + 0.05 * fifa.shoVolleys);
              fifa.sho = sho;
              break;
            case "pas":
              // 传球 = 20%视野 + 20%传中 + 5%任意球精度 + 15%长传 + 35%短传 + 5%弧线
              let pas = Math.round(0.20 * fifa.pasVision + 0.20 * fifa.pasCrossing + 0.05 * fifa.pasFKAccuracy
                + 0.15 * fifa.pasLongPassing + 0.35 * fifa.pasShortPassing + 0.05 * fifa.pasCurve);
              fifa.pas = pas;
              break;
            case "dri":
              // 盘带 = 10%敏捷 + 5%平衡 + 5%反应 + 0%沉着 + 30%控球 + 50%盘带
              let dri = Math.round(0.10 * fifa.driAgility + 0.05 * fifa.driBalance + 0.05 * fifa.driReactions
                + 0.30 * fifa.driBallControl + 0.50 * fifa.driDribbling);
              fifa.dri = dri;
              break;
            case "def":
              // 防守 = 20%拦截意识 + 10%头球精度 + 30%防守意识 + 30%抢断 + 10%铲球
              let def = Math.round(0.20 * fifa.defInterceptions + 0.10 * fifa.defHeading + 0.30 * fifa.defMarking
                + 0.30 * fifa.defStandingTackle + 0.10 * fifa.defSlidingTackle);
              fifa.def = def;
              break;
            case "phy":
              // 力量 = 5%弹跳 + 25%体能 + 50%强壮 + 20%侵略性
              let phy = Math.round(0.05 * fifa.phyJumping + 0.25 * fifa.phyStamina + 0.50 * fifa.phyStrength + 0.20 * fifa.phyAggression);
              fifa.phy = phy;
              break;
            case "pac":
              // 速度 = 55%速度 + 45%加速
              let pac = Math.round(0.55 * fifa.pacSprintSpeed + 0.45 * fifa.pacAcceleration);
              fifa.pac = pac;
              break;
            default:
              break;
          }
          // 计算位置得分
          // LS ST RS = Math.round(4%加速+5%速度+5%强壮+8%反应+13%跑位+10%控球+7%盘带+18%射术+10%头球+5%短传+10%射门力量+3%远射+2%凌空)
          const stRating = Math.round(0.04 * fifa.pacAcceleration + 0.05 * fifa.pacSprintSpeed + 0.05 * fifa.phyStrength + 0.08 * fifa.driReactions + 0.13 * fifa.shoPositioning + 0.10 * fifa.driBallControl + 0.07 * fifa.driDribbling + 0.18 * fifa.shoFinishing + 0.10 * fifa.defHeading + 0.05 * fifa.pasShortPassing + 0.10 * fifa.shoShotPower + 0.03 * fifa.shoLongShots + 0.02 * fifa.shoVolleys);
          // CF LF RF = Math.round(5%加速+5%速度+9%反应+13%跑位+8%视野+15%控球+14%盘带+11%射术+2%头球+9%短传+5%射门力量+4%远射)
          // 没有
          // CAM LAM RAM = Math.round(4%加速+3%速度+3%敏捷+7%反应+9%跑位+14%视野+15%控球+13%盘带+7%射术+4%长传+16%短传+5%远射)
          const camRating = Math.round(0.04 * fifa.pacAcceleration + 0.03 * fifa.pacSprintSpeed + 0.03 * fifa.driAgility + 0.07 * fifa.driReactions + 0.09 * fifa.shoPositioning + 0.14 * fifa.pasVision + 0.15 * fifa.driBallControl + 0.13 * fifa.driDribbling + 0.07 * fifa.shoFinishing + 0.04 * fifa.pasLongPassing + 0.16 * fifa.pasShortPassing + 0.05 * fifa.shoLongShots);
          // LW RW = Math.round(7%加速+6%速度+3%敏捷+7%反应+9%跑位+6%视野+14%控球+9%传中+16%盘带+10%射术+9%短传+4%远射)
          const rwRating = Math.round(0.07 * fifa.pacAcceleration + 0.06 * fifa.pacSprintSpeed + 0.03 * fifa.driAgility + 0.07 * fifa.driReactions + 0.09 * fifa.shoPositioning + 0.06 * fifa.pasVision + 0.14 * fifa.driBallControl + 0.09 * fifa.pasCrossing + 0.16 * fifa.driDribbling + 0.10 * fifa.shoFinishing + 0.09 * fifa.pasShortPassing + 0.04 * fifa.shoLongShots);
          // CM LCM RCM = Math.round(6%体能+8%反应+5%拦截意识+6%跑位+13%视野+14%控球+7%盘带+2%射术+13%长传+17%短传+4%远射+5%抢断)
          const cmRating = Math.round(0.06 * fifa.phyStamina + 0.08 * fifa.driReactions + 0.05 * fifa.defInterceptions + 0.06 * fifa.shoPositioning + 0.13 * fifa.pasVision + 0.14 * fifa.driBallControl + 0.07 * fifa.driDribbling + 0.02 * fifa.shoFinishing + 0.13 * fifa.pasLongPassing + 0.17 * fifa.pasShortPassing + 0.04 * fifa.shoLongShots + 0.05 * fifa.defStandingTackle);
          // LM RM = Math.round(7%加速+6%速度+5%体能+7%反应+8%跑位+7%视野+13%控球+10%传中+15%盘带+6%射术+5%长传+11%短传)
          const rmRating = Math.round(0.07 * fifa.pacAcceleration + 0.06 * fifa.pacSprintSpeed + 0.05 * fifa.phyStamina + 0.07 * fifa.driReactions + 0.08 * fifa.shoPositioning + 0.07 * fifa.pasVision + 0.13 * fifa.driBallControl + 0.10 * fifa.pasCrossing + 0.15 * fifa.driDribbling + 0.06 * fifa.shoFinishing + 0.05 * fifa.pasLongPassing + 0.11 * fifa.pasShortPassing);
          // CDM LDM RDM = Math.round(6%体能+4%强壮+7%反应+5%侵略性+14%拦截意识+4%视野+10%控球+10%长传+14%短传+9%防守意识+12%抢断+5%铲球)
          const cdmRating = Math.round(0.06 * fifa.phyStamina + 0.04 * fifa.phyStrength + 0.07 * fifa.driReactions + 0.05 * fifa.phyAggression + 0.14 * fifa.defInterceptions + 0.04 * fifa.pasVision + 0.10 * fifa.driBallControl + 0.10 * fifa.pasLongPassing + 0.14 * fifa.pasShortPassing + 0.09 * fifa.defMarking + 0.12 * fifa.defStandingTackle + 0.05 * fifa.defSlidingTackle);
          // LWB RWB = Math.round(4%加速+6%速度+10%体能+8%反应+12%拦截意识+8%控球+12%传中+4%盘带+10%短传+7%防守意识+8%抢断+11%铲球)
          const rwbRating = Math.round(0.04 * fifa.pacAcceleration + 0.06 * fifa.pacSprintSpeed + 0.10 * fifa.phyStamina + 0.08 * fifa.driReactions + 0.12 * fifa.defInterceptions + 0.08 * fifa.driBallControl + 0.12 * fifa.pasCrossing + 0.04 * fifa.driDribbling + 0.10 * fifa.pasShortPassing + 0.07 * fifa.defMarking + 0.08 * fifa.defStandingTackle + 0.11 * fifa.defSlidingTackle);
          // CB LCB RCB = Math.round(2%速度+3%弹跳+10%强壮+5%反应+7%侵略性+13%拦截意识+4%控球+10%头球+5%短传+14%防守意识+17%抢断+10%铲球)
          const cbRating = Math.round(0.02 * fifa.pacSprintSpeed + 0.03 * fifa.phyJumping + 0.10 * fifa.phyStrength + 0.05 * fifa.driReactions + 0.07 * fifa.phyAggression + 0.13 * fifa.defInterceptions + 0.04 * fifa.driBallControl + 0.10 * fifa.defHeading + 0.05 * fifa.pasShortPassing + 0.14 * fifa.defMarking + 0.17 * fifa.defStandingTackle + 0.10 * fifa.defSlidingTackle);
          // LB RB = Math.round(5%加速+7%速度+8%体能+8%反应+12%拦截意识+7%控球+9%传中+4%头球+7%短传+8%防守意识+11%抢断+14%铲球)
          const rbRating = Math.round(0.05 * fifa.pacAcceleration + 0.07 * fifa.pacSprintSpeed + 0.08 * fifa.phyStamina + 0.08 * fifa.driReactions + 0.12 * fifa.defInterceptions + 0.07 * fifa.driBallControl + 0.09 * fifa.pasCrossing + 0.04 * fifa.defHeading + 0.07 * fifa.pasShortPassing + 0.08 * fifa.defMarking + 0.11 * fifa.defStandingTackle + 0.14 * fifa.defSlidingTackle);
          // GK = Math.round(11%反应+21%鱼跃+21%手型+5%开球+21%站位+21%门将反应)
          const gkRating = Math.round(0.11 * fifa.driReactions + 0.21 * fifa.gkDiving + 0.21 * fifa.gkHandling + 0.05 * fifa.gkKicking + 0.21 * fifa.gkPositioning + 0.21 * fifa.gkReflexes);
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
          fifa.overallRating = fifa.positionRating[fifa.position];
        }
      });
      // 更新队员
      wx.cloud.callFunction({
        name: 'yun',
        data: {
          controller: 'sofifa',
          action: 'update',
          data: sofifa
        }
      }).then(res => {
        // 正确的执行结果
        console.log('更新队员能力信息成功', res);
        // 获取首页的队员列表
        const lstAllPlayer = JSON.parse(JSON.stringify(indexPage.data.lstAllPlayer));
        sofifa.fifalist.forEach(fifa => {
          let player = app.searchByParam(lstAllPlayer, '_id', fifa.playerid);
          fifa.player = player;
          fifa.player.strBirthday = app.formatDate(player.birthday, 'yyyy-MM-dd');
        });
        this.setData({
          info: '保存成功',
          sofifa: sofifa
        })
        wx.hideLoading();
      }).catch(err => {
        // 错误的执行结果
        console.log('更新队员能力信息失败', err);
        wx.hideLoading();
      })
    }).catch(err => {
      console.log('获取队员能力信息失败', err);
      wx.hideLoading();
    })
  },

  // 属性说明
  showDescription() {
    const modifyField = this.data.modifyField;
    this.data.lstField.forEach(six => {
      six.child.forEach(field => {
        if (modifyField === field.value) {
          this.setData({
            modifyFieldName: six.name + '-' + field.name,
            officialInterpretation: field.officialInterpretation,
            folkInterpretation: field.folkInterpretation,
            showDescriptionDialog: true
          })
        }
      });
    });
  },
  // 关闭提示框
  tapDialogButton(e) {
    this.setData({
      showPlayerDialog: false,
      showDescriptionDialog: false
    })
  },

  // 底部弹起的操作列表点击按钮事件
  btnClick(e) {
    wx.showLoading({
      title: '',
      mask: true
    })
    const playerid = this.data.fifa.player._id;
    // 0个人能力,1数据对比,2增加队员,3修改数据,4移除队员
    switch (e.detail.value) {
      case 0:
        // 0个人能力
        this.setData({
          showActionsheet: false,
          showPlayerDialog: true
        })
        wx.hideLoading();
        break;
      case 1:
        // 1数据对比
        let url = `compare?playerid1=` + playerid;
        wx.navigateTo({
          url: url,
        })
        this.setData({
          showActionsheet: false
        })
        wx.hideLoading();
        break;
      case 2:
        // 2增加队员
        wx.navigateTo({
          url: `info`,
        })
        this.setData({
          showActionsheet: false
        })
        wx.hideLoading();
        break;
      case 3:
        // 3修改数据
        let url2 = `info?playerid=` + playerid;
        wx.navigateTo({
          url: url2,
        })
        this.setData({
          showActionsheet: false
        })
        wx.hideLoading();
        break;
      case 4:
        // 4移除队员
        wx.cloud.callFunction({
          name: 'yun',
          data: {
            controller: 'sofifa',
            action: 'deletePlayer',
            data: {
              playerid: playerid
            }
          }
        }).then(res => {
          console.log('移除队员成功', res);
          // 从列表中移除队员
          let fifalist = this.data.sofifa.fifalist;
          for (let index = 0; index < fifalist.length; index++) {
            const fifa = fifalist[index];
            if (fifa.playerid === playerid) {
              fifalist.splice(index, 1);
              break;
            }
          }
          this.setData({
            [`sofifa.fifalist`]: fifalist,
            showActionsheet: false
          })
          wx.hideLoading();
        }).catch(err => {
          console.log('移除队员失败', err);
          wx.hideLoading();
        })
        break;
      default:
        this.setData({
          showActionsheet: false
        })
        wx.hideLoading();
        break;
    }
  },
})