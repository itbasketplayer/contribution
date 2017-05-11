var httphelper = require('./httphelper');
var logger = require('./logging').getLogger(module);
var gbk = require('./gbk');

var username = '70201168';
var password = 'dbf805da1099ba38a75ea295af80e59c';
var url = 'http://api.duanxin.cm/?action=send';
var SUCCESS_STATE = '100';

function random6() {
    var num = "";
    for (var i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
}

var sendMobile = {
    send: function (phone, callback) {
        var result = {};
        var mobileCode = random6();
        var content = "您的验证码为" + mobileCode + "，如不是您操作获取，请忽略本条信息。";
        url = url + "&username=" + username + "&password=" + password + "&phone=" + phone + "&content=" + gbk.encode(content);

        httphelper.get(url, 30000, function (err, data) {
            if (err) {
                logger.error(err);
                result.success = false;
                callback(err, result);
            } else {
                if (SUCCESS_STATE == data) {
                    result.success = true;
                    result.mobileCode = mobileCode;
                    callback(null, result);
                    logger.info("手机验证码：" + mobileCode);
                } else {
                    result.success = false;
                    callback(null, result);
                }
            }

        }, 'GBK');
    }
};

module.exports = sendMobile;
