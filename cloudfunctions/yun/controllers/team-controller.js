const BaseController = require('./base-controller.js')

class TeamController extends BaseController {
  // 根据月份获取球队战绩月报
  async getByMonth(data) {
    return await db.collection('team')
      .where({
        month: data.month
      }).get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
  }

  // 根据月份范围获取球队战绩月报
  async groupByMonthRange(data) {
    const { startMonth, endMonth } = data
    let result = await db.collection('team')
      .aggregate()
      .match({
        month: _.and(_.gte(startMonth), _.lte(endMonth))
      })
      .group({
        _id: null,
        match: $.sum('$match'),
        win: $.sum('$win'),
        draw: $.sum('$draw'),
        lost: $.sum('$lost'),
        goal: $.sum('$goal'),
        lose: $.sum('$lose'),
        join: $.sum('$join'),
        leave: $.sum('$leave')
      })
      .end()
      .then(result => this.success(result))
      .catch(() => this.fail([]))
    return result
  }

  // 新增球队战绩月报
  async add(data) {
    let result = await this.remove(data.month);
    result = await db.collection('team').add({
      data: {
        month: data.month,
        match: data.match,
        win: data.win,
        draw: data.draw,
        lost: data.lost,
        goal: data.goal,
        lose: data.lose,
        join: data.join,
        leave: data.leave,
        creater: data.creater,
        createtime: db.serverDate()
      }
    })
    return result
  }

  // 删除球队战绩月报
  async remove(data) {
    return await db.collection('team').where({ month: data }).remove()
  }

}

module.exports = TeamController