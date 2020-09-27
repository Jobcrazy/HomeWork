var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var error_code = require('../common/error_code');
var QueryMySQL = require('../common/database').QueryMySQL;
var Utils = require('../common/utils');
var Access = require('../common/access');

router.post("/add", function (req, res, next) {
    Access.checkAdmin(req.body.uid, req.body.token)
        .then(
            function (result) {
                //check whether vid exists
                var sql = 'SELECT id FROM hw_volunteer WHERE cid = ? AND vid = ?';
                var params = [req.body.cid, req.body.vid];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                if (result.length) {
                    //Exists
                    var err = {
                        message: "Volunteer Already Exists."
                    };
                    return Utils.SendErrJson(res, err);
                } else {
                    var sql = 'INSERT INTO hw_volunteer(`cid`, `vid`) VALUES(?, ?)';
                    var params = [req.body.cid, req.body.vid];
                    return QueryMySQL(sql, params);
                }
            }
        )
        .then(
            function (result) {
                if (result) {
                    var ret_obj = {
                        code: error_code.error_success,
                        id: result.insertId
                    }
                    res.send(JSON.stringify(ret_obj))
                }
            }
        )
        .catch(
            function (err) {
                Utils.SendErrJson(res, err)
            }
        )
})

router.post("/del", function (req, res, next) {
    Access.checkAdmin(req.body.uid, req.body.token)
        .then(
            function (result) {
                var sql = 'DELETE FROM hw_volunteer WHERE cid = ? AND vid = ?';
                var params = [req.body.cid, req.body.vid];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                var ret_obj = {
                    code: error_code.error_success
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

router.post("/get", function (req, res, next) {
    Access.checkAdmin(req.body.uid, req.body.token)
        .then(
            function (result) {
                var sql = 'Select vid as uid FROM hw_volunteer WHERE cid = ?';
                var params = [req.body.cid];

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