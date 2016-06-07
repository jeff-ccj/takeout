/*
 * @class   数据库连接配置模块
 * @author  Jeff Tsui
 * @date    16.05.04
 * @mail    jeff.ccjie@gmail.com
 */

var fs = require('fs')
var path = require('path')
var mongoose = require('mongoose')
var pomelo = require('pomelo-logger')
pomelo.configure(
    path.join(__dirname, '../logger.json')
    , {
        serverId: 666666
    }
)

var logger = pomelo.getLogger('log', __filename, process.pid)

//开启行号
process.env.LOGGER_LINE = true

logger.info('test1')
logger.warn('test2')
logger.error('test3')

var settings = require('../settings')

var dbURL = 'mongodb://'
    //+ settings.user + ':' + settings.name + '@'
    + settings.host + ':' + settings.port + '/' + settings.db

mongoose.connect(dbURL)

mongoose.connection.on('connected', function (err) {
    if (err) {
        logger.error('Database connection failure')
    }
})

mongoose.connection.on('error', function (err) {
    logger.error('Mongoose connected error ' + err)
})

mongoose.connection.on('disconnected', function () {
    logger.error('Mongoose disconnected')
})

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        //logger.info('Mongoose disconnected through app termination')
        process.exit(0)
    })
})

var DB = function () {
    this.mongoClient = {}
    var filename = path.join(path.dirname(__dirname), 'db_table.json')
    this.tabConf = JSON.parse(fs.readFileSync(path.normalize(filename)))
}


/**
 * 初始化mongoose model
 * @param tableName 表名称(集合名称)
 */
DB.prototype.getConnection = function (tableName) {
    if (!tableName) return
    if (!this.tabConf[tableName]) {
        logger.error('No table structure')
        return false
    }

    var client = this.mongoClient[tableName]

    if (!client) {

        //构建表结构
        var nodeSchema = new mongoose.Schema(this.tabConf[tableName])

        //构建model
        client = mongoose.model(tableName, nodeSchema, tableName)

        this.mongoClient[tableName] = client
    }

    return client

}


/**
 * 保存数据
 * @param tableName 表名
 * @param jData 表数据
 * @param callback 回调方法
 */
DB.prototype.save = function (tableName, jData, callback) {
    if (!jData) {
        if (callback) callback({msg: 'Field is not allowed for null'})
        return false
    }

    var err_num = 0
    for (var i in jData) {
        if (!this.tabConf[tableName][i]) err_num ++
    }
    if (err_num > 0) {
        if (callback) callback({msg: 'Wrong key name'})
        return false
    }

    var collection = this.getConnection(tableName)
    var mongooseEntity = new collection(jData)
    mongooseEntity.save(function (err, res) {
        if (err) {
            if (callback) callback(err)
        } else {
            if (callback) callback(null, res)
        }
    })
    
}


/**
 * 更新数据
 * @param tableName 表名
 * @param jParams 更新需要的条件 {_id: id, user_name: name}
 * @param jUpdateJson 要更新的字段 {age: 21, sex: 1}
 * @param callback 回调方法
 */
DB.prototype.update = function (tableName, jParams, jUpdateJson, callback) {

    if (!jUpdateJson || !jParams) {
        if (callback) callback({msg: 'Parameter error'})
        return
    }
    var collection = this.getConnection(tableName)

    collection.update(jParams, {$set: jUpdateJson}, {multi: true, upsert: true}, function (err, res) {
        if (err) {
            if (callback) callback(err)
        } else {
            if (callback) callback(null, res)
        }
    })
}


/**
 * 更新数据方法(带操作符的)
 * @param tableName 数据表名
 * @param jParams 更新条件 {_id: id, user_name: name}
 * @param jUpdateJson 更新的操作符 {$set: {id: 123}}
 * @param callback 回调方法
 */
DB.prototype.updateData = function (tableName, jParams, jUpdateJson, callback) {
    if (!jUpdateJson || !jParams) {
        if (callback) callback({msg: 'Parameter error'})
        return
    }
    var collection = this.getConnection(tableName)
    collection.findOneAndUpdate(jParams, jUpdateJson, {multi: true, upsert: true}, function (err, data) {
        if (callback) callback(err, data)
    })
}

/**
 * 删除数据
 * @param tableName 表名
 * @param jParams 删除需要的条件 {_id: id}
 * @param callback 回调方法
 */
DB.prototype.remove = function (tableName, jParams, callback) {
    var collection = this.getConnection(tableName)
    collection.remove(jParams, function (err, res) {
        if (err) {
            if (callback) callback(err)
        } else {
            if (callback) callback(null, res)
        }
    })
}

/**
 * 查询数据
 * @param tableName 表名
 * @param jParams 查询条件
 * @param jData 待返回字段
 * @param callback 回调方法
 */
DB.prototype.find = function (tableName, jParams, jData, callback) {
    var collection = this.getConnection(tableName)
    collection.find(jParams, jData || null, { }, function (err, res) {
        if (err) {
            callback(err)
        } else {
            callback(null, res)
        }
    })
}

/**
 * 查询单条数据
 * @param tableName 表名
 * @param jParams 查询条件
 * @param callback 回调方法
 */
DB.prototype.findOne = function (tableName, jParams, callback) {
    var collection = this.getConnection(tableName)
    collection.findOne(jParams, function (err, res) {
        if (err) {
            callback(err)
        } else {
            callback(null, res)
        }
    })
}

/**
 * 根据_id查询指定的数据
 * @param tableName 表名
 * @param _id 可以是字符串或 ObjectId 对象。
 * @param callback 回调方法
 */
DB.prototype.findById = function (tableName, _id, callback) {
    var collection = this.getConnection(tableName)
    collection.findById(_id, function (err, res) {
        if (err) {
            callback(err)
        } else {
            callback(null, res)
        }
    })
}

/**
 * 返回符合条件的文档数
 * @param tableName 表名
 * @param jParams 查询条件
 * @param callback 回调方法
 */
DB.prototype.count = function (tableName, jParams, callback) {
    var collection = this.getConnection(tableName)
    collection.count(jParams, function (err, res) {
        if (err) {
            callback(err)
        } else {
            callback(null, res)
        }
    })
}

/**
 * 查询符合条件的文档并返回根据键分组的结果
 * @param tableName 表名
 * @param field 待返回的键值
 * @param jParams 查询条件
 * @param callback 回调方法
 */
DB.prototype.distinct = function (tableName, field, jParams, callback) {
    var collection = this.getConnection(tableName)
    collection.distinct(field, jParams, function (err, res) {
        if (err) {
            callback(err)
        } else {
            callback(null, res)
        }
    })
}

/**
 * 连写查询
 * @param tableName 表名
 * @param jParams 查询条件 {a:1, b:2}
 * @param options 选项：{jData: 'a b c', sort: {time: -1}, limit: 10}
 * @param callback 回调方法
 */
DB.prototype.where = function (tableName, jParams, options, callback) {
    var collection = this.getConnection(tableName)
    collection.find(jParams)
        .select(options.jData || '')
        .sort(options.sort || {})
        .skip(options.skip || 0)
        .limit(options.limit || {})
        .exec(function (err, res) {
            if (err) {
                callback(err)
            } else {
                callback(null, res)
            }
        })
}

module.exports = new DB()





//
//var settings = require('../settings'),
//    Db = require('mongodb').Db,
//    Connection = require('mongodb').Connection,
//    Server = require('mongodb').Server

//module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true})