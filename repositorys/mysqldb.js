var mysqlpoolquery = require('./mysql-pool-query');
//暂时保留无args版本，但下次开发时，args必须有，防止注入
var mysqldb = {
    excute: function (sql, handler, args) {
        var options = [];
        options["sql"] = sql;
        options["args"] = args;
        options["handler"] = handler;
        mysqlpoolquery.execQuery(options);
    },
    page: function (sql, page, handler, args) {
        var options = [];
        options["sql"] = sql;
        options["args"] = args;
        options["handler"] = handler;
        options["page"] = page;
        mysqlpoolquery.execQuery(options);
    }
}

module.exports = mysqldb;


