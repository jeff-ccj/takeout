/*
 * @class   路由绑定
 * @author  Jeff Tsui
 * @date    16.04.16
 * @mail    jeff.ccjie@gmail.com
 */

//md5
var crypto = require('crypto')

/*
 * @class 路由函数
 * @param  {Object}  express对象
 * @date 16.04.16
 */
var routes = function (app) {

    /*
     * @class  所有页面预操作
     * @date 16.04.16
     */
    //app.get('*', function (req, res, next) {
    //
    //
    //})


    /*
     * @class 获取博客路由相关模块
     * @date 16.04.16
     */
    var blog = require('./blog.js')

    /*
     * @class 首页与首页分页
     * @date 16.04.16
     */
    app.get(/\/(\d+)|(\/$)/, function (req, res, next) {

        //当前页面
        var iPage = req.params[0] || 1

        //获取博客数据
        blog.get(res, next, '', '', iPage)

    })

        /*
         * @class 获取单篇文章
         * @date 16.05.11
         */
        .get('/blog/:id?', function (req, res, next) {

            var iId = req.params.id

            blog.getOne(res, next, iId)

        })

        /*
         * @class 发送博客post请求
         * @date 16.04.16
         */
        .post('/blog', function(req, res, next){

            //用户名与发表内容等数据
            var currentUser = req.session.user
                , jData = {
                name: currentUser.name
                , title: req.body.title
                , tags: req.body.tags
                , content: req.body.content
                , thumbPic: req.body.thumbPic
            }

            //调用发送函数
            blog.send(res, jData)

        })

        /*
         * @class 编辑博客post请求
         * @date 16.04.16
         */
        .put('/blog', function(req, res, next){

            var iId = req.body.id
                , jData = {
                title: req.body.title
                , tags: req.body.tags
                , content: req.body.content
                , thumbPic: req.body.thumbPic
            }

            blog.edit(res, iId, jData)

        })


        /*
         * @class 删除博客post请求
         * @date 16.04.16
         */
        .delete('/blog', function(req, res, next){

            var iId = req.body.id

            blog.delete(res, iId)

        })

        /*
         * @class 某用户下所有博客
         * @date 16.04.16
         */
        .get('/user/:name/:page?', function(req, res, next){

            var uName = req.params.name
                , iPage = req.params.page || 1

            blog.get(res, next, uName, '/user/' + uName, iPage)

        })


    /*
     * @class 获取用户下操作
     * @date 16.05.04
     */
    var userManage = require('./manage.js')

    /*
     * @class 注册页面信息
     * @date 16.05.04
     */
    app.get('/reg', function (req, res) {

            userManage.getRegister(res)

        })

        /*
         * @class 注册请求
         * @date 16.05.04
         */
        .post('/reg', function (req, res, next) {

            var md5 = crypto.createHash('md5')
                , password = md5.update(req.body.password).digest('base64')
                , jData = {
                username: req.body.username
                , password: password
            }

            userManage.register(req, res, jData)

        })


        /*
         * @class 登陆页面信息
         * @date 16.05.04
         */
        .get('/login', function (req, res) {

            userManage.getLogin(res)

        })

        /*
         * @class 登陆请求
         * @date 16.05.04
         */
        .post('/login', function (req, res, next) {

            var md5 = crypto.createHash('md5')
                , password = md5.update(req.body.password).digest('base64')
                , jData = {
                username: req.body.username
                , password: password
            }

            userManage.login(req, res, jData)

        })

        /*
         * @class 退出登录请求
         * @date 16.05.04
         */
        .post('/logout', function (req, res) {

            userManage.logout(req, res)

        })


    /*
     * @class 文件上传
     * @date 16.05.10
     */
    var file = require('./file.js')
    app.post('/upload/image', function (req, res) {

        file.uploadImg(req, res)

    })


    /*
     * @class 找不到页面(404)
     * @date 16.05.04
     */
    app.use(function (req, res) {


        var tipsInfo = {
            statusCode : 404
            , msg : '找不到页面'
            , pre : '错误代码'
        }
        res.status(tipsInfo.statusCode)
            .render('error', {
                title: '服务器错误'
                , message: tipsInfo.msg
                , error: {
                    status : tipsInfo.statusCode
                    , stack : tipsInfo.pre
                }

            })


    })


}


module.exports = routes