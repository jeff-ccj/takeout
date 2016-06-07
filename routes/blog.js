/*
 * @class   博客路由
 * @author  Jeff Tsui
 * @date    16.05.05
 * @mail    jeff.ccjie@gmail.com
 */

var Blog = require('../models/blog.js')
var paginate = require('../models/paginate.js')

var blog = {

    /**
     * 获取页面并实例化
     * @param res node对象
     * @param next 传递到下一个匹配路由
     * @param uName 用户名
     * @param url 页面url,用于分页
     * @param page 页码
     */
    get: function (res, next, uName, url, page) {

        var size = 10
            , page = page || 1

        Blog.getPage(
            uName
            , {
                page: page
                , size: size
            }
            , function (err, data, count) {

                //超过页数
                if(page > Math.ceil(count / size) && page != 1){

                    next()

                    return

                }

                if(data){

                    return res.render('index', {
                        title: uName ? uName + '的微博' : '多人博客--首页'
                        , uName: uName
                        , blogs: data
                        , pages: paginate({
                            nowPage: page
                            , size: size
                            , count: count
                            , url: url
                        })
                    })

                }else {

                    //404
                    next()

                }


            }
        )

    }


    /**
     * 发布博客
     * @param res node对象
     * @param params 发布参数
     * @param params.name 用户名
     * @param params.title 博客标题
     */
    , send: function (res, params) {

        var blog = new Blog(params)

        blog.save(function (err, data) {

            if (err) {
                return res.json({
                    success: 0
                    , data: err.msg
                })
            }

            if (data) {
                return res.json({
                    success: 1
                    , msg: '发布成功'
                    , json: data
                })
            }

        })
    }


    /**
     * 修改博客
     * @param res node对象
     * @param id [ObjectId] 博客id
     * @param params [Object] 发布参数
     */
    , edit: function (res, id, params) {

        Blog.edit(id, params, function (err) {

            if (err) {
                return res.json({
                    success: 0
                    , data: err.msg
                })
            }

            return res.json({
                success: 1
                , msg: '修改成功'
                , json: params
            })

        })
    }


    /**
     * 删除博客
     * @param res node对象
     * @param id [ObjectId] 博客id
     */
    , delete: function (res, id) {

        Blog.delete(id, function (err) {

            if (err) {
                return res.json({
                    success: 0
                    , data: err.msg
                })
            }

            return res.json({
                success: 1
                , msg: '删除成功'
            })

        })
    }


    /**
     * 获取单篇博客
     * @param res node对象
     * @param id [ObjectId] 博客id
     */
    , getOne : function (res, next, id) {

        Blog.getBlogItem(id, function(err, data){

            if(data){

                return res.render('blog/item', {
                    title: data.title
                    , blog: data
                })

            }else {

                //404
                next()

            }

        })

    }

}

//暴露接口
module.exports = blog


