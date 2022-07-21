const BaseController = require('./base-controller.js')

class SofifaController extends BaseController {
  // 返回信息
  async get() {
    return await db.collection('sofifa').doc('f6e08a646284b26503d02fd1193abcdf').get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
  }

  // 增加队员
  async addPlayer(data) {
    return await db.collection('sofifa').doc('f6e08a646284b26503d02fd1193abcdf').update({
      data: {
        updater: data.updater,
        updatetime: db.serverDate(),
        fifalist: _.push({
          each: [
            {
              index: data.index,
              playerid: data.playerid,
              position: data.position,
              bestPosition: data.bestPosition,
              weakFoot: data.weakFoot,
              skillMoves: data.skillMoves,
              attWorkRate: data.attWorkRate,
              defWorkRate: data.defWorkRate,
              overallRating: data.overallRating,
              bestOverallRating: data.bestOverallRating,
              potential: data.potential,
              pacSprintSpeed: data.pacSprintSpeed,
              pacAcceleration: data.pacAcceleration,
              shoFinishing: data.shoFinishing,
              shoPositioning: data.shoPositioning,
              shoShotPower: data.shoShotPower,
              shoLongShots: data.shoLongShots,
              shoPenalties: data.shoPenalties,
              shoVolleys: data.shoVolleys,
              pasVision: data.pasVision,
              pasCrossing: data.pasCrossing,
              pasFKAccuracy: data.pasFKAccuracy,
              pasLongPassing: data.pasLongPassing,
              pasShortPassing: data.pasShortPassing,
              pasCurve: data.pasCurve,
              driAgility: data.driAgility,
              driBalance: data.driBalance,
              driReactions: data.driReactions,
              driComposure: data.driComposure,
              driBallControl: data.driBallControl,
              driDribbling: data.driDribbling,
              defInterceptions: data.defInterceptions,
              defHeading: data.defHeading,
              defMarking: data.defMarking,
              defStandingTackle: data.defStandingTackle,
              defSlidingTackle: data.defSlidingTackle,
              phyJumping: data.phyJumping,
              phyStamina: data.phyStamina,
              phyStrength: data.phyStrength,
              phyAggression: data.phyAggression,
              gkDiving: data.gkDiving,
              gkHandling: data.gkHandling,
              gkKicking: data.gkKicking,
              gkPositioning: data.gkPositioning,
              gkReflexes: data.gkReflexes,
              sho: data.sho,
              pas: data.pas,
              dri: data.dri,
              def: data.def,
              phy: data.phy,
              pac: data.pac,
              traitlist: data.traitlist,
              positionRating: data.positionRating
            }
          ],
          sort: {
            index: 1
          }
        })
      }
    })
  }

  // 更新全部
  async update(data) {
    return await db.collection('sofifa').doc('f6e08a646284b26503d02fd1193abcdf').update({
      data: {
        fifalist: data.fifalist,
        updater: data.updater,
        updatetime: db.serverDate()
      }
    })
  }

  // 删除队员
  async deletePlayer(data) {
    return await db.collection('sofifa').doc('f6e08a646284b26503d02fd1193abcdf').update({
      data: {
        fifalist: _.pull({
          playerid: _.eq(data.playerid)
        })
      }
    })
  }

}

module.exports = SofifaController