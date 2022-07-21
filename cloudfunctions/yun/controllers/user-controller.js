const BaseController = require('./base-controller.js')

class UserController extends BaseController {
  // 返回访问用户的openId等信息
  async openid() {
    const wxContext = cloud.getWXContext()
    return await {
      data: wxContext
    }
  }

  // 返回用户信息
  async getUser(data) {
    return await db.collection('user').doc(data.userid).get()
    .then(result => this.success(result.data))
    .catch(() => this.fail([]))
  }

  // 返回匹配openid的用户信息
  async getByOpenid(data) {
    return await db.collection('user')
      .where({
        openid: data.openid
      }).get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
  }

  // 新增用户信息
  async add(data) {
    return await db.collection('user').add({
      data: {
        openid: data.openid,
        playerid: data.playerid,
        name: data.name,
        foot: data.foot,
        birthday: new Date(data.birthday),
        height: data.height,
        weight: data.weight,
        positional: data.positional,
        createtime: db.serverDate()
      }
    })
  }

  // 更新用户信息
  async update(data) {
    return await db.collection('user').where({
      _id: _.eq(data._id)
    }).update({
      data: {
        name: data.name,
        foot: data.foot,
        birthday: new Date(data.birthday),
        height: data.height,
        weight: data.weight,
        positional: data.positional,
        updater: data.updater,
        updatetime: db.serverDate()
      }
    })
  }

  // 更新playerid
  async setPlayerid(data) {
    return await db.collection('user').doc(data.userid).update({
      data: {
        playerid: data.playerid,
        updatetime: db.serverDate()
      }
    })
  }

  // 删除playerid
  async removePlayerid(data) {
    return await db.collection('user').doc(data.userid).update({
      data: {
        playerid: _.remove(),
        updatetime: db.serverDate()
      }
    })
  }

  // 获取未关联队员的用户列表
  async list(data) {
    const { pageIndex, pageSize } = data
    let result = await db.collection('user')
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      // .where({
      //   playerid: _.exists(false)
      // })
      .orderBy('createtime', 'desc')
      .get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))

    return result
  }
}

module.exports = UserController