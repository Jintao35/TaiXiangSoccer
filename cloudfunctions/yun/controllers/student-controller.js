const BaseController = require('./base-controller.js')

class StudentController extends BaseController {
  // 根据月份获取队员战绩年报
  async listByYear(data) {
    const year = data
    let result = await db.collection('student')
      .where({
        year: _.eq(year)
      })
      .get()
      .then(result => this.success(result.data))
      .catch(() => this.fail([]))
    return result
  }

  // 新增队员战绩年报
  async add(data) {
    let result = await this.remove(data.year);
    result = await db.collection('student').add({
      data: {
        year:data.year,
        playerlist:data.lstStudentReport,
        creater: data.creater,
        createtime: db.serverDate()
      }
    })
    return result
  }

  // 删除队员战绩年报
  async remove(data) {
    return await db.collection('student').where({ year: data }).remove()
  }

}

module.exports = StudentController