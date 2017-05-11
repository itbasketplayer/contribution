var winston = require('winston');
var fs = require('fs');
var path = require('path');

//fs.mkdir('./logs', function(err) {});

// Define levels to be like log4j in java
var customLevels = {
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    },
    colors: {
        debug: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red'
    }
};

var filename = "msite.log";
// create the main logger
var logger = new (winston.Logger)({
    level: 'info',
    levels: customLevels.levels,
    transports: [
        // setup console logging
        new (winston.transports.Console)({
            level: 'info', // Only write logs of info level or higher
            levels: customLevels.levels,
            colorize: true
        }),
        // setup logging to file
        new (winston.transports.File)({
            filename: './logs/' + filename,
            maxsize: 1024 * 1024 * 100, // 10MB
            level: 'info',
            levels: customLevels.levels,
            json: false
        })
    ]
});

var Logging = function () {
    var loggers = {};

    // always return the singleton instance, if it has been initialised once already.
    if (Logging.prototype._singletonInstance) {
        return Logging.prototype._singletonInstance;
    }

    this.getLogger = function (name) {
        return loggers[name];
    }

    this.get = this.getLogger;

    loggers['project-debug.log'] = logger;

    Logging.prototype._singletonInstance = this;
};
new Logging();
// make winston aware of your awesome colour choices
winston.addColors(customLevels.colors);

function getClazz(module) {
    if (module) {
        if (module.id) {
            if (module.id == '.') {
                return "[web-app-main] "
            }
            return "[" + path.basename(module.id) + "] ";
        } else {
            return "[" + module + "] ";
        }
    }
    return "";
}

module.exports.getLogger = function (module) {
    var clazz = getClazz(module);
    return {
        info: function (msg) {
            logger.info(clazz + msg);
        }
        , error: function (msg) {
            logger.error(clazz + msg);
        }
        , warn: function (msg) {
            logger.warn(clazz + msg);
        }
        , debug: function (msg) {
            logger.debug(clazz + msg);
        }
    };
}