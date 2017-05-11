var _ = require('underscore');
var logger = require('../../commons/logging').getLogger(module);
var async = require('async');
var mysqldb = require('../../repositorys/mysqldb');

var controller = {

    getRule: function (req, res) {

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
            res.render("pc/rules", {
                "activity": result.findOneActivity,
                "id":id,
                "awards":result.findAwards
            });
        });
    }
};

module.exports = controller;