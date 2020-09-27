var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var formidable = require('formidable');
var error_code = require('../common/error_code');
var QueryMySQL = require('../common/database').QueryMySQL;
var Utils = require('../common/utils');
var Access = require('../common/access');

router.post("/add", function (req, res, next) {
    Access.checkAdmin(req.body.gid, req.body.token)
        .then(
            function (result) {
                //Strip all space first
                innercourseid = req.body.couseid.replace(/\s+/g, "");

                var sql = 'INSERT INTO hw_course(`innercourseid`, `courseid`, ' +
                    '`term`, `instructor`, `class`) VALUES(?, ?, ?, ?, ?)';
                var params = [innercourseid, req.body.couseid, req.body.term,
                    req.body.instructor, req.body.class];

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

router.post("/del", function (req, res, next) {
    Access.checkAdmin(req.body.gid, req.body.token)
        .then(
            function (result) {
                var sql = 'DELETE FROM hw_course WHERE id = ?';
                var params = [req.body.cid];

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

module.exports = router;
