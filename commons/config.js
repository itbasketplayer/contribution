var nconf = require('nconf');
var path = require('path');

nconf.argv().env();
var node_env = process.env.NODE_ENV || 'dev';
console.log(node_env);

if ("dev" === node_env) {
    nconf.file({file: 'resources/env/config-dev.json'});
} else if ("pre" === node_env) {
    nconf.file({file: 'resources/env/config-pre.json'});
} else if ("prd" === node_env) {
    nconf.file({file: 'resources/env/config-prd.json'});
}

//module.exports.nconf = nconf;
module.exports.config = {
    hostname: nconf.get("hostname")
    , username: nconf.get("username")
    , password: nconf.get("password")
    , database: nconf.get("database")
    , port: nconf.get("port")
    , poolSize: nconf.get("poolSize")
    , charset: nconf.get("charset")
    , maxConnLimit: nconf.get("maxConnLimit")
    , web_domain: nconf.get("web_domain")
    , image_path: nconf.get("image_path")
    , image_fs: nconf.get("image_fs")
    , redis_port: nconf.get("redis_port")
    , redis_host: nconf.get("redis_host")
    , today_mobile_count: nconf.get("today_mobile_count")
    , today_ip_count: nconf.get("today_ip_count")
    , interval_second: nconf.get("interval_second")
}