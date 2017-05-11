var _ = require('underscore');
var logger = require('../../commons/logging').getLogger(module);
var async = require('async');
var mysqldb = require('../../repositorys/mysqldb');

var controller = {

    get: function (req, res) {
        var id = req.param("id");
        async.auto({
            findOneActivity: function (callback) {
                var findOneActivitySql = "select * from oper_activity where id = " + id;
                mysqldb.excute(findOneActivitySql, function (results) {
                    callback(null, results[0]);
                });
            }
        }, function (err, result) {
            if(err){
                logger.error("error:" + err);
            }
            var activity = result.findOneActivity;
            res.render("pc/submit.ejs", {
                "activity": activity,
                "id":id
            });
        });
    },
    post: function (req, res) {
        var avatar = req.param("avatar");
        var title = req.param("title");
        var content = req.param("content");
        var phoneNo = req.param("phoneNo");
        var userName = req.param("userName");
        var activityId = req.param("activityId");

        var insertTime = new Date().toMysqlFormat();

        var insertSql = "insert into oper_activity_contribution(version,avatar,title,content,phoneNo,publishTime,status,userName,sharenum,votenum,activity_id)" +
                        " VALUES (0,'"+avatar+"','"+title+"','"+content+"','"+phoneNo+"','"+insertTime+"','显示'"+",'"+userName+"',0,0,"+activityId+")";
        mysqldb.excute(insertSql,function(result){
            console.log("insert:"+result);
            if(result){
                res.send(true);
            }else{
                res.send(false);
            }

        });
    }
};

module.exports = controller;