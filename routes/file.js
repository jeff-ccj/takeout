/*
 * @class   文件上传
 * @author  Jeff Tsui
 * @date    16.05.10
 * @mail    jeff.ccjie@gmail.com
 */

var UploadFile = require('../models/upload.js')

var file = {

    /**
     * 单张图片上传
     * @param req node对象
     * @param res node对象
     */
    uploadImg: function (req, res) {

        var imgData = req.body.pic

        upload = new UploadFile(imgData, req.session.user.name)

        upload.image(function(err, url){

            if(err){
                return res.json({
                    success: 0
                    , data: err.msg
                })
            }else{
                return res.json({
                    success: 1
                    , data: {
                        url: url
                        , msg: '保存成功'
                    }
                })
            }

        })

    }

}

//暴露接口
module.exports = file


