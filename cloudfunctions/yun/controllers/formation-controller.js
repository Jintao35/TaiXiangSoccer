const BaseController = require('./base-controller.js')

class FormationController extends BaseController {
  // 获取阵容模拟信息
  async get(data) {
    return await db.collection('formation').where({ creater: data.creater }).get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
  }

  // 新增阵容模拟信息
  async add(data) {
    return await db.collection('formation').add({
      data: {
        quarterlist: data.quarterlist,
        creater: data.creater,
        createtime: db.serverDate()
      }
    })
  }

  // 更新阵容模拟信息
  async update(data) {
    return await db.collection('formation').where({ creater: data.creater }).update({
      data: {
        quarterlist: data.quarterlist,
        updater: data.updater,
        updatetime: db.serverDate()
      }
    })
  }

}

module.exports = FormationController