/*
 * @class   用户管理相关路由
 * @author  Jeff Tsui
 * @date    16.05.05
 * @mail    jeff.ccjie@gmail.com
 */

var User = require('../models/user.js')

var user = {

    /**
     * 获取注册页面
     * @param res node对象
     */
    getRegister: function (res) {

        res.render('reg', {
            title: '用户注册'
        });

    }


    /**
     * 用户注册
     * @param req node对象
     * @param res node对象
     * @param jData 注册信息
     * @param jData.username 用户名
     * @param jData.password 密码
     */
    , register: function (req, res, jData) {

        var newUser = new User({
            name: jData.username
            , password: jData.password
        });

        User.get( newUser.name, function(err, user){

            if (user){
                return res.json({
                    success: 0
                    , msg: '用户名已注册'
                });
            }

            newUser.save(function(err) {

                if (err) {
                    return res.json({
                        success: 0
                        , msg: err
                    });
                }

                req.session.user = newUser;

                return res.json({
                    success: 1
                    , msg: newUser.name + '注册成功'
                    , name: newUser.name
                });


            });

        })

    }


    /**
     * 用户登陆页面
     * @param res node对象
     */
    , getLogin: function (res) {

        res.render('login', {
            title: '用户登陆'
        });

    }


    /**
     * 用户登陆
     * @param req node对象
     * @param res node对象
     * @param jData 登陆信息
     * @param jData.username 用户名
     * @param jData.password 密码
     */
    , login: function (req, res, jData) {

        User.get(jData.username , function(err, user){

            if (!user){

                return res.json({
                    success: 0
                    , msg: '用户不存在'
                });

            }

            if(user.password != jData.password){

                return res.json({
                    success: 0
                    , msg: '用户密码错误'
                });

            }

            //console.log(req)
            req.session.user = user

            return res.json({
                success: 1
                , msg: '登陆成功'
                , id: user.id
            });

        })

    }


    /**
     * 退出登陆
     * @param req node对象
     * @param res node对象
     */
    , logout: function (req, res) {

        req.session.user = null;

        return res.json({
            success: 1
            , msg: '登出成功'
        });

    }

}

module.exports = user;


