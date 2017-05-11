var logger = require('./logging').getLogger(module);
var redis = require('redis');
var config = require('./config').config;
var client = redis.createClient(config.redis_port,config.redis_host,{});

//错误监听
client.on("error", function (err) {
    console.log("redis client error!")
});

module.exports = {
    get: function (key, callback) {
        client.get(key,callback);
    },
    set:function (key, value, callback) {
        client.set(key, value, callback);
    },
    setWithExpire:function (key, value, timeout, callback) {
        client.set(key, value, callback);
        client.expire(key, timeout);
    },
    close:function() {
        client.close();
    }
}


