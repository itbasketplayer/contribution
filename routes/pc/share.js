var _ = require('underscore');
var logger = require('../../commons/logging').getLogger(module);
var async = require('async');
var mysqldb = require('../../repositorys/mysqldb');
var ipUtil = require('../../commons/iputil');

var controller = {

    share: function (req, res) {
        var cid = req.param("cid");
        var channel = req.param("channel");
        var ip = ipUtil.getClientIp(req);
        var result = ipUtil.getProvinceCity(ip);
        var shareTime = new Date().toMysqlFormat();

        var insertShareSql = "insert into oper_contribution_share(version,channel,ip,city,shareTime,province,activitycontribution_id)" +
                " values(?,?,?,?,?,?,?)";
        var args = [0,channel,ip,result.city,shareTime,result.province,cid];
        mysqldb.excute(insertShareSql, function (result) {
            console.log(result.insertId);
            if (result) {
                res.send(true);
            } else {
                res.send(false);
            }
        },args);
    }

}

module.exports = controller;