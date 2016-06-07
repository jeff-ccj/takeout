/*
 * @class   配置文件
 * @author  Jeff Tsui
 * @date    16.04.10
 * @mail    jeff.ccjie@gmail.com
 */

//初始化express对象
var express = require('express')
//解析http请求
var bodyParser = require('body-parser')
//路径相关处理
var path = require('path')
//设置图标
var favicon = require('static-favicon')
//文件操作
var fs = require('fs')
//日志
//var logger = require('pomelo-logger').getLogger('apps-log')
//路由
var routes = require('./routes/init')
//express对象
var app = express()

app.set('views', path.join(__dirname, 'home/views'))
//设置coffee
//设置静态文件地址&模板
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({
  extended: true
  , limit: '50mb'
}))
app.use(bodyParser.json({
  limit: '50mb'
}))
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'uploads')))

//session & cookie 中间件
var session = require('express-session')
var cookieParser = require('cookie-parser')
var MongoStore = require('connect-mongo')(session)
var settings = require('./settings')

app.use(cookieParser())
//设置数据库session
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, //30 days
  store: new MongoStore({
    db: settings.db,
    url: 'mongodb://' + settings.host + '/'+ settings.db,
    host: settings.host,
    port: settings.port
  })
}))

//传入url 与 session
app.use(function (req, res, next) {
  res.locals.user = req.session ? req.session.user :''
  res.locals.url = req.path
  next()
})

//调用路由
routes(app)



// 只用于开发环境
if (app.get('env') === 'development') {

  console.log(app.get('env'))

}

//启动输出端口
process.env.PORT = 6666
app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})

//暴露接口
module.exports = app
