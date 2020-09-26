var express = require('express');
var crypto = require('crypto');
var formidable = require('formidable');
var error_code = require('../common/error_code');
var QueryMySQL = require('../common/database').QueryMySQL;

var router = express.Router();

const token_key = "mY7bZ8GKN6usrx36";

function SendErrJson(res, err) {
    var result = {
        code: err ? err.code : error_code.error_unknown,
        msg: err ? err.message : "Unknown Error"
    };
    res.send(JSON.stringify(result));
}

router.post('/login', function (req, res, next) {
    var sql = 'SELECT token from hw_user where gid = ?';
    var params = [req.body.gid];

    QueryMySQL(sql, params)
        .then(
            function (result) {
                var token = null;
                if (0 == result.length) {
                    //User does not exists, generate token add to database
                    token = crypto.createHash('md5')
                        .update(req.body.gid + token_key).digest("hex")

                    var sql = 'INSERT INTO hw_user( `gid`, `fname`, `gname`, ' +
                        '`xname`, `head`, `email`, `token`) VALUES(?, ?, ?, ?, ?, ?, ?)';
                    var params = [req.body.gid, req.body.fname, req.body.gname,
                        req.body.xname, req.body.head, req.body.email, token];

                    return QueryMySQL(sql, params)
                        .then(function (result) {
                        var ret_obj = {
                            code: error_code.error_success,
                            token: token
                        }
                        res.send(JSON.stringify(ret_obj))
                    });
                } else {
                    //User exists
                    token = result[0].token;
                    var ret_obj = {
                        code: error_code.error_success,
                        token: token
                    }
                    res.send(JSON.stringify(ret_obj))
                }
            })
        .catch(
            function (err) {
                return SendErrJson(res, err);
            })
});

module.exports = router;