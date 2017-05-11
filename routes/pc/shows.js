var _ = require('underscore');
var logger = require('../../commons/logging').getLogger(module);
var async = require('async');
var mysqldb = require('../../repositorys/mysqldb');
var page = require("../../commons/page");

var controller = {

    shows: function (req, res) {

        var id = req.param("id");
        var pageNo = req.param("pageNo");
        async.auto({
            findOneActivity: function (callback) {
                var findOneActivitySql = "select * from oper_activity where id = " + id;
                mysqldb.excute(findOneActivitySql, function (results) {
                    callback(null, results[0]);
                });
            },
            findPageActivity: function (callback) {
                var findPageActivitySql = "select * from oper_activity_contribution where activity_id = " + id;
                page.pageNo = pageNo;
                page.pageSize = 2;
                page.init();

                mysqldb.page(findPageActivitySql, page, function (results) {
                    callback(null, results);
                });
            }
        }, function (err, result) {
            console.log(JSON.stringify(result.findPageActivity));
            res.render("pc/shows", {
                "id": id,
                "activity": result.findOneActivity,
                "page": result.findPageActivity
            });
        });
    },
    addVotenum: function(req, res){
        var cid = req.param("cid");
        var addVotenumSql = "update oper_activity_contribution set votenum = votenum + 1 where id = " + cid;
        mysqldb.excute(addVotenumSql,function(results){
            res.send({success:true});
        });
    }
};

module.exports = controller;