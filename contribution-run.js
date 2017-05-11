var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var domain = require('domain');
var global = require('./commons/global');
var morgan = require('morgan');
var logger = require('./commons/logging').getLogger(module);//自己封装的log，设置4种类型
var path = require('path');
var routes = require('./commons/routes');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var js2MysqlDate = require('./commons/js2mysqldate');
var router = express.Router();

var app = express();

app.use(function (req, res, next) {
    var d = domain.create();
    //监听domain的错误事件
    d.on('error', function (err) {
        logger.error(err);
        res.statusCode = 500;
        res.json({sucess: false, messag: 'server error...'});
        //d.dispose();
    });

    d.add(req);
    d.add(res);
    d.run(next);
});

// all environments
app.set('port', process.env.PORT || 5001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use("/activity", express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));   // parse application/x-www-form-urlencoded
app.use(bodyParser.json());   // parse application/json


app.use(cookieParser());
app.use(session({
    key: 'JSESSIONID',
    resave: true,
    saveUninitialized: true,
    secret: 'yuhaibin',
    cookie: {maxAge: 30 * 60 * 1000}
}));
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(methodOverride());

var env = process.env.NODE_ENV || 'dev';
if ('dev' == env) {
    app.use(errorHandler());
} else if ('prd' == env) {
    app.enable('view cache');
}

//ejs全局变量
global(app);
routes(app);


app.listen(app.get('port'), function () {
    logger.info('Express server listening on port ' + app.get('port'));
});

