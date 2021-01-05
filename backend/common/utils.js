var fs = require("fs");
var path = require('path');
var error_code = require('./error_code');

var Utils = {
    //Format DateTime String
    "dateFtt": function (fmt, date) { //author: meizz
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    "crtTimeFtt": function () {
        var crtTime = new Date();
        return this.dateFtt("yyyy-MM-dd hh:mm:ss", crtTime);
    },
    "crtTimeMs": function () {
        var crtTime = new Date();
        return this.dateFtt("hh-mm-ss-S", crtTime);
    },
    "crtTimeDate": function () {
        var crtTime = new Date();
        return this.dateFtt("yyyy-MM-dd", crtTime);
    },
    "mkdirsSync": function (dirpath, mode) {
        if (!fs.existsSync(dirpath)) {
            var pathtmp;
            dirpath.split(path.sep).forEach(function (dirname) {
                if (dirname == "") {
                    dirname = "/"
                }
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                } else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true;
    },
    "SendErrJson": function (res, err) {
        var result = {
            code: err.code ? err.code : error_code.error_unknown,
            msg: err.message ? err.message : "Unknown Error"
        };
        res.send(JSON.stringify(result));
    }
};

exports = module.exports = Utils;