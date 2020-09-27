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
                //Strip all space first
                innercourseid = req.body.couseid.replace(/\s+/g, "");

                var sql = 'INSERT INTO hw_course(`innercourseid`, `courseid`, ' +
                    '`term`, `instructor`, `class`, `logo`) VALUES(?, ?, ?, ?, ?, ?)';
                var params = [innercourseid, req.body.couseid, req.body.term,
                    req.body.instructor, req.body.class, req.body.logo];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                var ret_obj = {
                    code: error_code.error_success,
                    cid: result.insertId
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
    Access.checkAdmin(req.body.uid, req.body.token)
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

router.post("/search", function (req, res, next) {
    //Strip all space first
    innercourseid = req.body.couseid.replace(/\s+/g, "");

    var CurrentPage = req.body.page ? parseInt(req.body.page) : 1;
    var NumbersPerPage = req.body.limit ? parseInt(req.body.limit) : 20;
    var Start = CurrentPage * NumbersPerPage - NumbersPerPage;

    var sql = 'SELECT id, courseid, term, instructor, class FROM hw_course ' +
        'WHERE innercourseid = ? ORDER BY id desc limit ?,?';
    var params = [innercourseid, Start, NumbersPerPage];

    QueryMySQL(sql, params)
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

router.post("/list", function (req, res, next) {
    var CurrentPage = req.body.page ? parseInt(req.body.page) : 1;
    var NumbersPerPage = req.body.limit ? parseInt(req.body.limit) : 20;
    var Start = CurrentPage * NumbersPerPage - NumbersPerPage;

    var sql = 'SELECT id, courseid, term, instructor, class FROM hw_course ' +
        'ORDER BY id desc limit ?,?';
    var params = [Start, NumbersPerPage];

    QueryMySQL(sql, params)
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

router.post("/follow", function (req, res, next) {
    Access.checkUser(req.body.uid, req.body.token)
        .then(
            function (result) {
                //check whether vid exists
                var sql = 'SELECT id FROM hw_follow WHERE cid = ? AND uid = ?';
                var params = [req.body.cid, req.body.uid];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                if (result.length) {
                    //Exists
                    var err = {
                        message: "Already Followed."
                    };
                    return Utils.SendErrJson(res, err);
                } else {
                    var sql = 'INSERT INTO hw_follow(`cid`, `uid`) VALUES(?, ?)';
                    var params = [req.body.cid, req.body.uid];
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

router.post("/unfollow", function (req, res, next) {
    Access.checkUser(req.body.uid, req.body.token)
        .then(
            function (result) {
                //check whether vid exists
                var sql = 'DELETE FROM hw_follow WHERE cid = ? AND uid = ?';
                var params = [req.body.cid, req.body.uid];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                if (result) {
                    var ret_obj = {
                        code: error_code.error_success
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

module.exports = router;
