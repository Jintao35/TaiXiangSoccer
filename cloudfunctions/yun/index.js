// 云函数入口文件
const cloud = require('wx-server-sdk')
const User = require('./controllers/user-controller.js')
const Player = require('./controllers/player-controller.js')
const Match = require('./controllers/match-controller.js')
const Formation = require('./controllers/formation-controller.js')
const Team = require('./controllers/team-controller.js')
const Student = require('./controllers/student-controller.js')
const Sofifa = require('./controllers/sofifa-controller.js')

const api = {
  user: new User(),
  player: new Player(),
  match: new Match(),
  formation: new Formation(),
  team: new Team(),
  student: new Student(),
  sofifa: new Sofifa()
}

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

global.cloud = cloud
global.db = cloud.database()
global._ = db.command
global.$ = _.aggregate

// 云函数入口
exports.main = async (event, context) => {
  const { controller, action, data } = event
  const result = await api[controller][action](data)
  return result
}
