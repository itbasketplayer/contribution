var _ = require('underscore');
var logger = require('../../commons/logging').getLogger(module);
var async = require('async');
var mysqldb = require('../../repositorys/mysqldb');
var page = require("../../commons/page");

var controller = {

    index: function (req, res) {

        var id = req.param("id");
        async.auto({
            findOneActivity: function (callback) {
                var findOneActivitySql = "select * from oper_activity where id = " + id;
                mysqldb.excute(findOneActivitySql, function (results) {
                    callback(null, results[0]);
                });
            },
            findListActivity: function (callback) {
                var findListActivitySql = "select * from oper_activity_contribution where activity_id = " + id;
                mysqldb.excute(findListActivitySql, function (results) {
                    callback(null, results);
                });
            },
            findPageActivity: function (callback) {
                var findPageActivitySql = "select * from oper_activity_contribution where activity_id = " + id;
                page.pageNo = 1;
                page.init();

                mysqldb.page(findPageActivitySql, page, function (results) {
                    callback(null, results);
                });
            }
        }, function (err, result) {
            logger.info("errr:" + err);
            res.render("test/index", {"model": result, "now": new Date()});
        });
    }
};

module.exports = controller;