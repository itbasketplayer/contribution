var config = require('../commons/config').config,
    async = require('async'),
    logger = require('../commons/logging').getLogger(module),
    pool = require('./mysql-pool');

module.exports = {
    execQuery: function (options) {
        var sql = options['sql'];
        var args = options['args'];
        var handler = options['handler'];
        var page = options["page"];

        pool.getConnection(function (error, connection) {
            if (error) {
                logger.error('DB-获取数据库连接异常！');
                throw error;
            }

            var tasks = {};
            if (!page) {
                tasks.queryResultList = function (callback) {
                    logger.info(sql);
                    args==null?connection.query(sql, callback):connection.query(sql, args, callback);
                };
            } else {
                tasks.total = function (callback) {
                    var sqlTotal = "select count(*) as count from (" + sql + ") as view";
                    logger.info("sqlTotal:" + sqlTotal);
                    args==null?connection.query(sqlTotal, callback):connection.query(sql, args, callback);
                }
                tasks.queryResultList = ["total", function (callback, results) {
                    sql = sql + " limit " + page.start + ", " + page.pageSize;
                    logger.info(sql);
                    args==null?connection.query(sql, callback):connection.query(sql, args, callback);
                }];
            }

            async.auto(tasks, function (err, results) {
                if (err) {
                    logger.error('DB-执行查询语句异常！' + err);
                    throw error;
                }

                console.log(results.queryResultList[0]);

                if (!page) {
                    handler(results.queryResultList[0]);
                } else {
                    page.results = results.queryResultList[0];
                    page.end(results.total[0][0]["count"]);
                    handler(page);
                }

                connection.release(function (error) {
                    if (error) {
                        logger.error('DB-关闭数据库连接异常！');
                        throw error;
                    }
                });
            });
        });
    }
}
