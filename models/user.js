/*
 * @class   用户相关操作
 * @author  Jeff Tsui
 * @date    16.05.05
 * @mail    jeff.ccjie@gmail.com
 */

var mongodb = require('./db')

/**
 * 实例化函数传参
 * @param user [Object] 用户名
 * @param user.name 用户名
 * @param user.password 密码
 */
function User(user) {
    this.name = user.name
    this.password = user.password
}

module.exports = User

/**
 * 存储用户信息
 * @param callback(err,data) 回调函数
 */
User.prototype.save = function(callback) {

    //要存入数据库的用户信息文档
    var user = {
        name: this.name,
        password: this.password,
    }

    mongodb.save('users', user, function(err, userInfo) {

        if (err) {
            return callback(err)
        }

        callback(null, userInfo)
    })

}

/**
 * 读取用户信息
 * @param name 用户名
 * @param callback(err,data) 回调函数
 */
User.get = function(name, callback) {

    mongodb.findOne('users'
        , {
            name: name
        }
        , function(err, userInfo) {

            if (err) {
                return callback(err)
            }

            callback(null, userInfo)

        })

}