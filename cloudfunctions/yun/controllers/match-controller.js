const BaseController = require('./base-controller.js')

class MatchController extends BaseController {
  // 获取比赛信息
  async get(data) {
    return await db.collection('match').doc(data.matchid).get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
  }

  // 获取比赛列表
  async listByYear(data) {
    const { pageIndex, pageSize, startDate, endDate } = data
    let result = await db.collection('match')
      .where({
        time: _.and(_.gte(new Date(startDate)), _.lt(new Date(endDate)))
      })
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .orderBy('time', 'desc')
      .get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
    return result
  }

  // 根据月份获取指定状态的比赛列表
  async listByMonth(data) {
    const { startDate, endDate } = data
    let result = await db.collection('match')
      .where({
        status: _.eq(1),
        time: _.and(_.gte(new Date(startDate)), _.lt(new Date(endDate)))
      })
      .orderBy('time', 'asc')
      .get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
    return result
  }

  // 根据对手名称和月份获取指定状态的比赛列表
  async listByEnemyAndDateRange(data) {
    const { startDate, endDate, enemy, pageIndex, pageSize } = data
    let result = await db.collection('match')
      .where({
        status: _.eq(2),
        enemy: _.eq(enemy),
        time: _.and(_.gte(new Date(startDate)), _.lt(new Date(endDate)))
      })
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .orderBy('time', 'desc')
      .get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
    return result
  }

  // 新增比赛信息
  async add(data) {
    return await db.collection('match').add({
      data: {
        time: new Date(data.time),
        duration: data.duration,
        charge: data.charge,
        fee: data.fee,
        competition: data.competition,
        stadium: data.stadium,
        man: data.man,
        enemy: data.enemy,
        color1: data.color1,
        color2: data.color2,
        memo: data.memo,
        playerlist: data.playerlist,
        goal: data.goal,
        lose: data.lose,
        scorelist: data.scorelist,
        assistlist: data.assistlist,
        mvplist: data.mvplist,
        lvplist: data.lvplist,
        dataflag: data.dataflag,
        workflag: data.workflag,
        status: data.status,
        creater: data.creater,
        createtime: db.serverDate()
      }
    })
  }

  // 更新比赛信息
  async update(data) {
    return await db.collection('match').doc(data._id).update({
      data: {
        time: new Date(data.time),
        duration: data.duration,
        charge: data.charge,
        fee: data.fee,
        competition: data.competition,
        stadium: data.stadium,
        man: data.man,
        enemy: data.enemy,
        color1: data.color1,
        color2: data.color2,
        memo: data.memo,
        playerlist: data.playerlist,
        goal: data.goal,
        lose: data.lose,
        scorelist: data.scorelist,
        assistlist: data.assistlist,
        mvplist: data.mvplist,
        lvplist: data.lvplist,
        dataflag: data.dataflag,
        workflag: data.workflag,
        status: data.status,
        updater: data.updater,
        updatetime: db.serverDate()
      }
    })
  }

  // 更新比赛阵容
  async updateSquad(data) {
    return await db.collection('match').doc(data._id).update({
      data: {
        quarterlist: data.quarterlist,
        playerlist: data.playerlist,
        updater: data.updater,
        updatetime: db.serverDate()
      }
    })
  }

  // 更新比赛结果
  async updateResult(data) {
    return await db.collection('match').doc(data._id).update({
      data: {
        playerlist: data.playerlist,
        scorelist: data.scorelist,
        assistlist: data.assistlist,
        mvplist: data.mvplist,
        goal: data.goal,
        lose: data.lose,
        status: data.status,
        updater: data.updater,
        updatetime: db.serverDate()
      }
    })
  }

  // 更新比赛状态
  async updateStatus(data) {
    return await db.collection('match').doc(data._id).update({
      data: {
        status: data.status
      }
    })
  }

  // // 根据月份更新比赛状态
  // async updateStatusByMonth(data) {
  //   const { startDate, endDate } = data
  //   return await db.collection('match')
  //     .where({
  //       time: _.and(_.gte(new Date(startDate)), _.lt(new Date(endDate))),
  //       status: _.eq(1)
  //     }).update({
  //       data: {
  //         status: 2
  //       }
  //     })
  // }

  // 删除比赛信息
  async remove(data) {
    return await db.collection('match').where({
      _id: _.eq(data._id)
    }).remove()
  }

  // // 队员报名
  // async playerSignup(data) {
  //   const createtime = new Date();
  //   return await db.collection('match').doc(data.matchid).update({
  //     data: {
  //       signuplist: _.push({
  //         each: [
  //           {
  //             playerid: data.playerid,
  //             createtime: createtime
  //           }
  //         ],
  //         sort: {
  //           time: 1
  //         }
  //       })
  //     }
  //   })
  // }

  // // 队员取消报名
  // async playerCancelSignup(data) {
  //   return await db.collection('match').doc(data.matchid).update({
  //     data: {
  //       signuplist: _.pull({
  //         playerid: _.eq(data.playerid)
  //       })
  //     }
  //   })
  // }

  // // 获取未开始的比赛场次
  // async matchCount(data) {
  //   return await db.collection('match').where({
  //     time: _.gte(new Date(data.time))
  //   }).count()
  // }

}

module.exports = MatchController