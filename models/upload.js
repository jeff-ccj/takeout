/*
 * @class   图片上传
 * @author  Jeff Tsui
 * @date    16.05.10
 * @mail    jeff.ccjie@gmail.com
 */

var fs = require('fs')
var path = require('path')

/**
 * 实例化上传函数
 * @param base64 [String] base64数值
 * @param pathName [String] /uploads/images/下路径
 */
function Uploads(base64, pathName) {

    this.imgData = base64
    this.pathName = pathName ? pathName + '/' : ''

}


/**
 * 保存图片
 * @param callback [Function] 回调函数
 */
Uploads.prototype.image = function(callback){

    var date = new Date()
        , sPathName =
            './uploads/images/'
            + this.pathName
            + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        , thisDir = path.join(sPathName)

    var oImgType = {
        jpeg: 'jpg'
        ,png: 'png'
        ,gif: 'gif'
    }
        , suffix

    //过滤data:URL,获取后缀名
    var base64Data = this.imgData.replace(/^data:image\/(\w+);base64,/, function(str, $0){

        for(var i in oImgType){
            if(i == $0) suffix = oImgType[i]
        }

        return ''

    })


    var dataBuffer = new Buffer(base64Data, 'base64')
        , imgDir = path.join(thisDir, +date + '.' + suffix)

    //创建文件夹
    mkdirs(thisDir, function () {

        //写入文件
        fs.writeFile(imgDir, dataBuffer, function(err) {
            if(err){
                return callback(err)
            }

            var url = imgDir.replace('uploads', '')
            return callback(err, url)

        })


    })

}


//递归创建各目录
function mkdirs(dirpath, callback) {
    if(!dirpath) return
    fs.exists(dirpath, function(exists) {
        if(exists) {
            callback(dirpath)
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), function(){
                fs.mkdir(dirpath, callback)
            })
        }
    })
}

module.exports = Uploads
