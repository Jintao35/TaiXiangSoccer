const BaseController = require('./base-controller.js')

class PlayerController extends BaseController {
  // 返回队员信息
  async get(data) {
    return await db.collection('player').doc(data.playerid).get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
  }

  // 获取队员列表
  async list(data) {
    const { pageIndex, pageSize } = data
    let result = await db.collection('player')
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .orderBy('index', 'asc')
      .get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
    return result
  }
  
  // 根据月份获取现役队员列表
  async selectByMonth(data) {
    // 入队日期<结束日期，离队日期>开始日期
    const searchParam = data;
    let result = await db.collection('player')
      .where({
        joinday: _.lt(new Date(searchParam.endDate)),
        leaveday: _.gte(new Date(searchParam.startDate))
      })
      .get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
    return result
  }

  // 根据用户信息新增队员信息并回写用户表playerid
  async addPlayerByUser(data) {
    // 获取用户信息
    let result = await db.collection('user').doc(data.userid).get()
    // 用户信息添加到player表
    result = await this.add(result.data)
    // 更新用户信息表的playerid
    return await db.collection('user').doc(data.userid).update({
      data: {
        playerid: result._id,
        updatetime: db.serverDate()
      }
    })
  }

  // 新增队员信息
  async add(data) {
    return await db.collection('player').add({
      data: {
        name: data.name ? data.name : '新队员',
        sex: data.sex,
        foot: data.foot,
        birthday: data.birthday ? new Date(data.birthday) : new Date('2000-01-01'),
        height: data.height ? data.height : 0,
        weight: data.weight ? data.weight : 0,
        pic: data.pic ? data.pic : '',
        memo: data.memo ? data.memo : '',
        index: data.index ? data.index : 99,
        joinday: data.joinday ? new Date(data.joinday) : new Date('2021-01-01'),
        leaveday: data.leaveday ? new Date(data.leaveday) : new Date('2099-12-31'),
        no: data.no ? data.no : '',
        role: data.role ? data.role : 0,
        org: data.org ? data.org : 0,
        positional: data.positional ? data.positional : [],
        disabled: data.disabled,
        creater: data.creater,
        createtime: db.serverDate()
      }
    })
  }

  // 更新队员信息
  async update(data) {
    return await db.collection('player').doc(data._id).update({
      data: {
        name: data.name ? data.name : '队员',
        sex: data.sex,
        foot: data.foot,
        birthday: data.birthday ? new Date(data.birthday) : new Date('2000-01-01'),
        height: data.height ? data.height : 0,
        weight: data.weight ? data.weight : 0,
        pic: data.pic ? data.pic : '',
        memo: data.memo ? data.memo : '',
        joinday: data.joinday ? new Date(data.joinday) : new Date('2021-01-01'),
        leaveday: data.leaveday ? new Date(data.leaveday) : new Date('2099-12-31'),
        no: data.no ? data.no : '',
        role: data.role ? data.role : 0,
        org: data.org ? data.org : 0,
        positional: data.positional ? data.positional : [],
        disabled: data.disabled,
        updater: data.updater,
        updatetime: db.serverDate()
      }
    })
  }

}

module.exports = PlayerController