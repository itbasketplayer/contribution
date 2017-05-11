var config = require('../commons/config').config,
    mysql = require('mysql'),
    async = require('async'),
    logger = require('../commons/logging').getLogger(module);

var options = {
    'host': config.hostname,
    'port': config.port,
    'user': config.username,
    'password': config.password,
    'database': config.database,
    'charset': config.charset,
    'connectionLimit': config.maxConnLimit,
    'supportBigNumbers': true,
    'bigNumberStrings': true
};

module.exports = mysql.createPool(options);