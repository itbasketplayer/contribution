var qqwry = require('lib-qqwry').info();
var stringUtil = require('./stringutil');

module.exports = {
    getClientIp: function (req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
    getProvinceCity:function getProvinceCity(ip){
        var country = qqwry.searchIP(ip).Country;
        var result = {
            province:"",
            city:"",
            other:""
        };
        var num1 = country.indexOf("省");
        for(var i=0;i<num1;i++){
            result.province += country.charAt(i);
        }
        var qsheng = result.province + "省";
        var text1 = country.replace(qsheng, "");

        var num2 = text1.indexOf("市");
        for(var i=0;i<num2;i++){
            result.city += text1.charAt(i);
        }

        if(stringUtil.isEmpty(result.province)&&stringUtil.isEmpty(result.city)){
            result.other = country;
        }
        return result;
    }

}