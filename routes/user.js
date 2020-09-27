var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var error_code = require('../common/error_code');
var QueryMySQL = require('../common/database').QueryMySQL;
var Utils = require('../common/utils');
var Access = require('../common/access');

const token_key = "mY7bZ8GKN6usrx36";

router.post('/login', function (req, res, next) {
    var sql = 'SELECT id, token from hw_user where gid = ?';
    var params = [req.body.gid];

    QueryMySQL(sql, params)
        .then(
            function (result) {
                var token = null;
                if (0 === result.length) {
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
                                uid: result.insertId,
                                token: token,
                            }
                            res.send(JSON.stringify(ret_obj))
                        });
                } else {
                    //User exists
                    var ret_obj = {
                        code: error_code.error_success,
                        uid: result[0].id,
                        token: result[0].token
                    }
                    res.send(JSON.stringify(ret_obj))
                }
            })
        .catch(
            function (err) {
                return Utils.SendErrJson(res, err);
            })
});

router.post("/info", function (req, res, next) {
    Access.checkUser(req.body.uid, req.body.token)
        .then(
            function (result) {
                var sql = 'SELECT id, fname, gname, xname, head from hw_user where id = ?';
                var params = [req.body.uid];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                var ret_obj = {
                    code: error_code.error_success,
                    data: result
                }
                res.send(JSON.stringify(ret_obj))
            }
        )
        .catch(
            function (err) {
                Utils.SendErrJson(res, err)
            }
        )
})

module.exports = router;