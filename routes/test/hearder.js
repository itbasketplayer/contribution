var _ = require('underscore');
var logger = require('../../commons/logging').getLogger(module);
var async = require('async');
var mysqldb = require('../../repositorys/mysqldb');
var fs = require('fs');
var sendMobile = require('../../commons/send-mobile');

var fileTypeArr = ['jpg','png','jpeg','bmp'];
var fileMaxSize = 2*1024*1024;  //2M

function contains(str,arr){
    for(var i in arr){
        if(str.toUpperCase() == arr[i].toUpperCase()){
            return true;
        }
    }
    return false;
}

var controller = {

    get: function (req, res) {
        sendMobile.send("15217603293", "js调用短信接口", function (err, result) {
            if (result) {
                logger.info("成功：" + result);
                res.render("test/ueditor");
            }
        });
    },
    upload: function (req, res) {
        if (Object.keys(req.files).length === 0) {
            logger.warn('no files uploaded');
            res.json({
                'state': 'FAIL',
                'originalname': '',
                'url': '',
                'message':'未上传文件'
            });
        } else {
            for (var i in req.files) {
                var img = req.files[i];
                if(!contains(img.extension,fileTypeArr)){
                    res.json({
                        'state': 'FAIL',
                        'originalname': '',
                        'url': '',
                        'message':'文件格式不对'
                    });
                    fs.unlink(img.path);
                    return;
                }
                if(img.size>fileMaxSize){
                    res.json({
                        'state': 'FAIL',
                        'originalname': '',
                        'url': '',
                        'message':'文件太大'
                    });
                    fs.unlink(img.path);
                    return;
                }
                var url = 'uploads/header/' + img.name;
                res.json({
                    'state': 'SUCCESS',
                    'url': url,
                    'originalname': img.originalname,
                    'message':'成功'
                });
            }

        }
    }
};

module.exports = controller;