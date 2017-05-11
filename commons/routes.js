var express = require('express');
var router = express.Router(); //router实现basepath功能

var config = require('./config');
var multer_config = require('./multer-config');
var dateUtil = require('./dateutil');
var index = require('../routes/pc/index');
var rules = require('../routes/pc/rules');
var shows = require('../routes/pc/shows');
var submit = require('../routes/pc/submit');
var sendMobileCode = require('../routes/pc/send-mobile-code');
var publish = require("../routes/pc/publish-award");
var share = require('../routes/pc/share');


module.exports = function (app) {

    config.version = (function () {

        var today = new Date();
        var year = today.getFullYear();
        var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        var day = (today.getDate()) < 10 ? '0' + (today.getDate()) : (today.getDate());
        var hours = (today.getHours()) < 10 ? '0' + (today.getHours()) : (today.getHours());
        var minutes = (today.getMinutes()) < 10 ? '0' + (today.getMinutes()) : (today.getMinutes());
        var seconds = (today.getSeconds()) < 10 ? '0' + (today.getSeconds()) : (today.getSeconds());
        return year + month + day + hours + minutes + seconds;

    })();
    app.locals.config = config;

    //日期格式化
    app.locals.dateFormat = dateUtil.format;


    //pc
    router.get("/pc/index", index.index);
    router.get("/pc/rules", rules.getRule);
    router.get("/pc/shows", shows.shows);
    router.post("/pc/addVotenum", shows.addVotenum);
    router.get("/pc/submit", submit.get);
    router.post("/pc/submit", submit.post);

    router.get("/pc/sendMobileCode", sendMobileCode.sendMobileCode);
    router.get("/pc/checkMobileCode", sendMobileCode.checkMobileCode);

    router.get("/pc/publish", publish.get);

    router.post("/pc/share", share.share);
    //wap

    //basepath或者作为一个迷你应用
    app.use('/activity', router);

};