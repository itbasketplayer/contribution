var _ = require('underscore');
var logger = require('../../commons/logging').getLogger(module);
var async = require('async');
var mysqldb = require('../../repositorys/mysqldb');
var dateUtil = require('../../commons/dateutil');

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
            findAwards: function(callback){
                var findAwardsSql = "select * from oper_award where activity_id = " + id;
                mysqldb.excute(findAwardsSql, function(results){
                    callback(null,results);
                });
            }
        }, function (err, result) {
            if(err){
                logger.error("error:" + err);
            }
            var activity = result.findOneActivity;
            var awards = result.findAwards;
            res.render("pc/index", {
                "activity": activity,
                "id":id,
                "awards":awards
            });
        });
    }
};

module.exports = controller;