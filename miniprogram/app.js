//app.js
App({
  data: {
    // 空白头像
    emptyPic: 'https://wx1.sinaimg.cn/large/008nJrvKly1guqn64wsydg601o01ot8h02.gif',
    // 国旗
    flagPic: 'https://wx1.sinaimg.cn/large/008nJrvKly1h37qp64m9wj301y0160r6.jpg',
    // 队徽
    badgePic: 'https://wx4.sinaimg.cn/large/008nJrvKly1h37qp4e5jrj303w03wq2x.jpg',
    // 金卡
    bgGolg: 'https://wx1.sinaimg.cn/large/008nJrvKly1h37qp7rd4mj30hw0p0mz4.jpg',
    // 银卡
    bgSilver: 'https://wx2.sinaimg.cn/large/008nJrvKly1h37qp99a2zj30hw0p0q4j.jpg',
    // 铜卡
    bgBronze: 'https://wx3.sinaimg.cn/large/008nJrvKly1h37qpa97mwj30hw0p0abv.jpg',
    lstSquad: [
      {
        rowIndex: 0, lstCell: [
          { cellIndex: 0, name: 'LS' },
          { cellIndex: 1, name: 'ST' },
          { cellIndex: 2, name: 'RS' }
        ]
      }, {
        rowIndex: 1, lstCell: [
          { cellIndex: 0, name: 'LW' },
          { cellIndex: 1, name: 'LAM' },
          { cellIndex: 2, name: 'CAM' },
          { cellIndex: 3, name: 'RAM' },
          { cellIndex: 4, name: 'RW' }
        ]
      }, {
        rowIndex: 2, lstCell: [
          { cellIndex: 0, name: 'LM' },
          { cellIndex: 1, name: 'LCM' },
          { cellIndex: 2, name: 'CM' },
          { cellIndex: 3, name: 'RCM' },
          { cellIndex: 4, name: 'RM' }
        ]
      }, {
        rowIndex: 3, lstCell: [
          { cellIndex: 0, name: 'LWB' },
          { cellIndex: 1, name: 'LDM' },
          { cellIndex: 2, name: 'CDM' },
          { cellIndex: 3, name: 'RDM' },
          { cellIndex: 4, name: 'RWB' }
        ]
      }, {
        rowIndex: 4, lstCell: [
          { cellIndex: 0, name: 'LB' },
          { cellIndex: 1, name: 'LCB' },
          { cellIndex: 2, name: 'CB' },
          { cellIndex: 3, name: 'RCB' },
          { cellIndex: 4, name: 'RB' }
        ]
      }, {
        rowIndex: 5, lstCell: [
          { cellIndex: 0, name: 'GK' }
        ]
      }
    ]
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
  },

  // 根据上场人数查询阵型
  getSquadListByMan(man) {
    return this.data.lstAllSquad.filter(item => item.people === man);
  },

  // 根据上场人数和后卫人数查询阵型
  getSquadListByManAndDefend(man, defend) {
    return this.data.lstAllSquad.filter(item => item.people === man && item.defenders === defend);
  },

  // 根据阵型名称获取阵型
  getSquadBySquadName(name) {
    return this.data.lstAllSquad.filter(item => item.name === name)[0];
  },

  // 根据字段获取集合中的对象
  searchByParam(list, column, param) {
    let object = list.find(function (obj) {
      return obj[column] === param
    })
    return object;
  },

  // 判断集合中是否存在对象
  containsKey(list, column, key) {
    let object = list.find(function (obj) {
      return obj[column] === key
    })
    if (list.indexOf(object) > -1) {
      return true;
    } else {
      return false;
    }
  },

  // 获取年龄
  getAge(birthday) {
    let returnAge = 0;
    const birthYear = birthday.getFullYear();
    const birthMonth = birthday.getMonth() + 1;
    const birthDay = birthday.getDate();
    const d = new Date();
    const nowYear = d.getFullYear();
    const nowMonth = d.getMonth() + 1;
    const nowDay = d.getDate();
    if (nowYear == birthYear) {
      returnAge = 0;//同年 则为0周岁
    } else {
      const ageDiff = nowYear - birthYear; //年之差
      if (ageDiff > 0) {
        if (nowMonth == birthMonth) {
          const dayDiff = nowDay - birthDay;//日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        } else {
          const monthDiff = nowMonth - birthMonth;//月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          }
          else {
            returnAge = ageDiff;
          }
        }
      } else {
        returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
      }
    }
    return returnAge;//返回周岁年龄
  },

  //时间戳格式化
  formatDate: function (now, mask) {
    var d = new Date(now);
    var zeroize = function (value, length) {
      if (!length) length = 2;
      value = String(value);
      for (var i = 0, zeros = ''; i < (length - value.length); i++) {
        zeros += '0';
      }
      return zeros + value;
    };
    return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
      switch ($0) {
        case 'd': return d.getDate();
        case 'dd': return zeroize(d.getDate());
        // case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
        case 'ddd': return ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
        case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
        case 'M': return d.getMonth() + 1;
        case 'MM': return zeroize(d.getMonth() + 1);
        case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
        case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
        case 'yy': return String(d.getFullYear()).substr(2);
        case 'yyyy': return d.getFullYear();
        case 'h': return d.getHours() % 12 || 12;
        case 'hh': return zeroize(d.getHours() % 12 || 12);
        case 'H': return d.getHours();
        case 'HH': return zeroize(d.getHours());
        case 'm': return d.getMinutes();
        case 'mm': return zeroize(d.getMinutes());
        case 's': return d.getSeconds();
        case 'ss': return zeroize(d.getSeconds());
        case 'l': return zeroize(d.getMilliseconds(), 3);
        case 'L': var m = d.getMilliseconds();
          if (m > 99) m = Math.round(m / 10);
          return zeroize(m);
        case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
        case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
        case 'Z': return d.toUTCString().match(/[A-Z]+$/);
        default: return $0.substr(1, $0.length - 2);
      }
    });
  }
})
