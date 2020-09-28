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

router.post("/update", function (req, res, next) {
    Access.checkVolunteer(req.body.cid, req.body.uid, req.body.token)
        .then(
            function (result) {
                var sql = 'UPDATE hw_homework SET cid=?, title=?, ' +
                    'description=?, due=? WHERE id=?';
                var params = [req.body.cid, req.body.title, req.body.description,
                    req.body.due, req.body.kid];

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

router.post("/ongoing", function (req, res, next) {
    Access.checkUser(req.body.uid, req.body.token)
        .then(
            function (result) {
                /*
                e.g.:
                SELECT hw_homework.id, hw_homework.cid, hw_homework.title,
                hw_homework.description, hw_homework.due, hw_course.courseid,
                hw_course.term, hw_course.instructor, hw_course.instructor,
                hw_course.class, hw_course.logo
                FROM hw_course JOIN (
                    SELECT id, cid, title, description, due FROM hw_homework
                    WHERE cid NOT IN (
                        SELECT cid FROM hw_done
                        WHERE hw_done.uid = 1 AND hw_done.kid=2
                    )
                ) as hw_homework ON
                hw_homework.cid = hw_course.id
                AND hw_homework.due >= '2020-09-30 23:59:59'
                 */
                var CurrentPage = req.body.page ? parseInt(req.body.page) : 1;
                var NumbersPerPage = req.body.limit ? parseInt(req.body.limit) : 20;
                var Start = CurrentPage * NumbersPerPage - NumbersPerPage;
                var current_date_time = Utils.crtTimeFtt();
                var sql = 'SELECT hw_homework.id, hw_homework.cid, hw_homework.title, \n' +
                    'hw_homework.description, hw_homework.due, hw_course.courseid, \n' +
                    'hw_course.term, hw_course.instructor, hw_course.instructor,\n' +
                    'hw_course.class, hw_course.logo \n' +
                    'FROM hw_course JOIN ( \n' +
                    '    SELECT id, cid, title, description, due FROM hw_homework \n' +
                    '    WHERE cid NOT IN (\n' +
                    '        SELECT cid FROM hw_done \n' +
                    '        WHERE hw_done.uid = ?\n' +
                    '    ) \n' +
                    ') as hw_homework ON \n' +
                    'hw_homework.cid = hw_course.id \n' +
                    'AND hw_homework.due >= ? ORDER BY id desc limit ?,?';
                var params = [req.body.uid, current_date_time, Start, NumbersPerPage];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                var ret_obj = {
                    code: error_code.error_success,
                    data:result
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

router.post("/finished", function (req, res, next) {
    Access.checkUser(req.body.uid, req.body.token)
        .then(
            function (result) {
                var CurrentPage = req.body.page ? parseInt(req.body.page) : 1;
                var NumbersPerPage = req.body.limit ? parseInt(req.body.limit) : 20;
                var Start = CurrentPage * NumbersPerPage - NumbersPerPage;
                var current_date_time = Utils.crtTimeFtt();
                var sql = 'SELECT hw_homework.id, hw_homework.cid, hw_homework.title, \n' +
                    'hw_homework.description, hw_homework.due, hw_course.courseid, \n' +
                    'hw_course.term, hw_course.instructor, hw_course.instructor,\n' +
                    'hw_course.class, hw_course.logo \n' +
                    'FROM hw_course JOIN ( \n' +
                    '    SELECT id, cid, title, description, due FROM hw_homework \n' +
                    '    WHERE cid IN (\n' +
                    '        SELECT cid FROM hw_done \n' +
                    '        WHERE hw_done.uid = ?\n' +
                    '    ) \n' +
                    ') as hw_homework ON \n' +
                    'hw_homework.cid = hw_course.id \n' +
                    'ORDER BY id desc limit ?,?';
                var params = [req.body.uid, Start, NumbersPerPage];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                var ret_obj = {
                    code: error_code.error_success,
                    data:result
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

router.post("/overdue", function (req, res, next) {
    Access.checkUser(req.body.uid, req.body.token)
        .then(
            function (result) {
                var CurrentPage = req.body.page ? parseInt(req.body.page) : 1;
                var NumbersPerPage = req.body.limit ? parseInt(req.body.limit) : 20;
                var Start = CurrentPage * NumbersPerPage - NumbersPerPage;
                var current_date_time = Utils.crtTimeFtt();
                var sql = 'SELECT hw_homework.id, hw_homework.cid, hw_homework.title, \n' +
                    'hw_homework.description, hw_homework.due, hw_course.courseid, \n' +
                    'hw_course.term, hw_course.instructor, hw_course.instructor,\n' +
                    'hw_course.class, hw_course.logo \n' +
                    'FROM hw_course JOIN ( \n' +
                    '    SELECT id, cid, title, description, due FROM hw_homework \n' +
                    '    WHERE cid NOT IN (\n' +
                    '        SELECT cid FROM hw_done \n' +
                    '        WHERE hw_done.uid = ?\n' +
                    '    ) \n' +
                    ') as hw_homework ON \n' +
                    'hw_homework.cid = hw_course.id \n' +
                    'AND hw_homework.due <= ? ORDER BY id desc limit ?,?';
                var params = [req.body.uid, current_date_time, Start, NumbersPerPage];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                var ret_obj = {
                    code: error_code.error_success,
                    data:result
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