var _ = require('underscore')
    , config = require('./config').config;

// 全局方法变量,ejs模块调用
module.exports = function (app) {

    app.locals.web_domain = config.web_domain;
    app.locals.image_path = config.image_path;
    app.locals.image_fs = config.image_fs;
    app.locals.interval_second = config.interval_second;

    app.locals._ = _;  // 将underscore导入到ejs模板中
    //app.locals.joinKeys = util.joinKeys;  // 链接关键字
};
