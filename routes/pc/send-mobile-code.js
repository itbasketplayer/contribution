var _ = require('underscore');
var logger = require('../../commons/logging').getLogger(module);
var sendMobile = require('../../commons/send-mobile');
var redis = require('../../commons/redis-client');
var async = require('async');
var config = require('../../commons/config').config;
var iputil = require('../../commons/iputil');

var today_ip_count = config.today_ip_count;
var EXPIRE_SECONDS = config.interval_second;
var TODAY_IP_EXPIRE_SECONDS = 60*60*24; //一天
var SUPFIX = "_count";

var controller = {

    sendMobileCode: function (req, res) {
        var mobile = req.param("mobile");
        var ip = iputil.getClientIp(req);
        var ipKey = ip+SUPFIX;
        async.auto({
            getRedisIpCount:function(callback){
                redis.get(ipKey, function (err, reply) {
                    callback(null,reply);
                });
            },
            sendMobile: ['getRedisIpCount',function (callback,results) {
                var count = results.getRedisIpCount;
                if(!count){
                    redis.setWithExpire(ipKey, 1, TODAY_IP_EXPIRE_SECONDS, function (err, replay) {
                    });
                    sendMobile.send(mobile, callback);
                }else{
                    count = parseInt(count);
                    if(count<today_ip_count){
                        redis.setWithExpire(ipKey, parseInt(count)+1, TODAY_IP_EXPIRE_SECONDS, function (err, replay) {
                        });
                        sendMobile.send(mobile, callback);
                    }else{
                        redis.setWithExpire(ipKey, parseInt(count)+1, TODAY_IP_EXPIRE_SECONDS, function (err, replay) {
                        });
                        //超过限定次数，模拟发送验证码出错
                        var result = {};
                        result.success = false;
                        callback(null,result);
                    }
                }

            }],
            redisJob: ['getRedisIpCount','sendMobile', function (callback, results) {
                var result = results.sendMobile;
                if (result.success) {
                    redis.setWithExpire(mobile, result.mobileCode, EXPIRE_SECONDS, function (err, replay) {
                        if (err) {
                            logger.error(err);
                        }
                        if(replay){
                            logger.info(replay);
                        }

                    });
                }
                res.send(result.success);
            }]
        });
    },
    checkMobileCode: function (req, res) {
        var mobile = req.param("mobile");
        var mobileCode = req.param("mobileCode");
        redis.get(mobile, function (err, reply) {
            if (err) {
                logger.error(err);
                res.send(false);
            }
            if(reply){
                if (reply != mobileCode) {
                    res.send(false);
                } else {
                    res.send(true);
                }
            }else{
                res.send(false);
            }
        });
    }

};

module.exports = controller;