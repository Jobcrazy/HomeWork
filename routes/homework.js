var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var error_code = require('../common/error_code');
var QueryMySQL = require('../common/database').QueryMySQL;
var Utils = require('../common/utils');
var Access = require('../common/access');

router.post("/add", function (req, res, next) {
    Access.checkVolunteer(req.body.cid, req.body.uid, req.body.token)
        .then(
            function (result) {
                var sql = 'INSERT INTO hw_homework(`cid`, `title`, ' +
                    '`description`, `due`) VALUES(?, ?, ?, ?)';
                var params = [req.body.cid, req.body.title, req.body.description,
                    req.body.due];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                var ret_obj = {
                    code: error_code.error_success,
                    id: result.insertId
                }
                res.send(JSON.stringify(ret_obj));
            }
        )
        .catch(
            function (err) {
                Utils.SendErrJson(res, err);
            }
        )
})

router.post("/del", function (req, res, next) {
    Access.checkVolunteer(req.body.cid, req.body.uid, req.body.token)
        .then(
            function (result) {
                var sql = 'DELETE FROM hw_homework WHERE id = ?'
                var params = [req.body.id];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                var ret_obj = {
                    code: error_code.error_success,
                }
                res.send(JSON.stringify(ret_obj));
            }
        )
        .catch(
            function (err) {
                Utils.SendErrJson(res, err)
            }
        )
})

router.post("/done", function (req, res, next) {
    Access.checkUser(req.body.uid, req.body.token)
        .then(
            function (result) {
                var sql = 'SELECT id FROM hw_done WHERE ' +
                    'cid=? AND uid=? AND kid=?';
                var params = [req.body.cid, req.body.uid, req.body.kid];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                if (result.length) {
                    var ret_obj = {
                        code: error_code.error_success,
                        id: result[0].id
                    }
                    return res.send(JSON.stringify(ret_obj))
                } else {
                    var sql = 'INSERT INTO hw_done(`cid`, `uid`, `kid`) ' +
                        'VALUES(?, ?, ?)';
                    var params = [req.body.cid, req.body.uid, req.body.kid];
                    return QueryMySQL(sql, params);
                }
            }
        )
        .then(
            function (result) {
                var ret_obj = {
                    code: error_code.error_success,
                    id: result.insertId
                }
                return res.send(JSON.stringify(ret_obj));
            }
        )
        .catch(
            function (err) {
                Utils.SendErrJson(res, err);
            }
        )
})

router.post("/unfinished", function (req, res, next) {
    Access.checkUser(req.body.uid, req.body.token)
        .then(
            function (result) {
                var sql = 'DELETE FROM hw_done WHERE ' +
                    'cid=? AND uid=? AND kid=?';
                var params = [req.body.cid, req.body.uid, req.body.kid];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                var ret_obj = {
                    code: error_code.error_success
                }
                return res.send(JSON.stringify(ret_obj));
            }
        )
        .catch(
            function (err) {
                Utils.SendErrJson(res, err);
            }
        )
})

module.exports = router;