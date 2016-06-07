/*
 * @class   博客相关操作
 * @author  Jeff Tsui
 * @date    16.05.05
 * @mail    jeff.ccjie@gmail.com
 */

var mongodb = require('./db')
    , ObjectID = require('mongodb').ObjectID

/**
 * 实例化函数传参
 * @param name 用户名
 * @param title 标题
 * @param tags 标签
 * @param content 内容
 */
function Blog(jParams) {

    for(var i in jParams){
        this[i] = jParams[i]
    }

}

//暴露接口
module.exports = Blog

/**
 * 提交一篇博客
 * @param callback(err,data) 回调函数
 */
Blog.prototype.save = function(callback) {

    var date = new Date()

    //存储各种时间格式，方便以后扩展
    var time = {
        date: date
        , year : date.getFullYear()
        , month : date.getFullYear() + "-" + (date.getMonth() + 1)
        , day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        , minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }

    //要存入数据库的文档
    var blogData = {
        name: this.name
        , thumbPic: this.thumbPic || ''
        , time: time
        , title: this.title
        , tags: this.tags
        , content: this.content
        , comments: []
        , reprint_info: {}
        , pv: 1
    }

    mongodb.save('blogs', blogData, function(err, blogList) {

        if (err) {
            return callback(err)
        }

        callback(null, blogList)
    })

}


/**
 * 获取博客列表
 * @param name 用户名
 * @param pageParam 分页参数
 * @param pageParam.page 页码
 * @param pageParam.size 一页多少篇
 * @param callback(err,data) 回调函数
 */
Blog.getPage = function(name, pageParam, callback){

    var page = pageParam.page
        , pageSize = pageParam.size
        , params = {}

    if (name) {
        params.name = name
    }
    
    mongodb.count('blogs', params , function(err, total) {

        var options = {
            jData: "title time name thumbPic"
            , sort: {time: -1}
            , limit: 10
            , skip: (page - 1) * pageSize
        }

        mongodb.where('blogs', params , options, function(err, docs) {

            if (err) {
                return callback(err)
            }

            return callback(null, docs, total)

        })

    })

}


/**
 * 修改内容
 * @param id 博客id
 * @param updateField [Object] 修改数据
 * @param callback(err,data) 回调函数
 */
Blog.edit = function(id, updateField, callback) {

    var param = {
        '_id' : ObjectID(id),
    }

    mongodb.update('blogs', param , updateField, function(err, data) {

        if (err) {
            return callback(err)
        }

        return callback(null, data)

    })


}


/**
 * 删除博客
 * @param id 博客id
 * @param callback(err,data) 回调函数
 */
Blog.delete = function(id, callback) {

    var param = {
        '_id' : ObjectID(id)
    }

    mongodb.remove('blogs', param , function(err, data) {

        if (err) {
            return callback(err)
        }

        return callback(null, data)

    })


}

/**
 * 获取单篇文章
 * @param id 博客id
 * @param callback(err,data) 回调函数
 */
Blog.getBlogItem = function(id, callback) {

    mongodb.findById('blogs', id , function(err, data) {

        if (err) {
            return callback(err)
        }

        //pv增加1
        mongodb.updateData(
            'blogs'
            , {_id: id}
            , { $inc: {'pv': 1}}
            , function(err){}
        )

        return callback(null, data)

    })

}