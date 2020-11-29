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
                var params = [req.body.cid, req.body.title, "", req.body.due];

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
});

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
});

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
                SELECT
                    hw_homework.cid,
                    hw_homework.title,
                    hw_homework.description,
                    hw_homework.due,
                    hw_course.courseid,
                    hw_course.term,
                    hw_course.instructor,
                    hw_course.instructor,
                    hw_course.class,
                    hw_course.logo
                FROM
                    hw_homework
                LEFT JOIN hw_course ON hw_homework.cid = hw_course.id
                WHERE
                    hw_homework.cid IN(
                    SELECT
                        cid
                    FROM
                        hw_follow
                    WHERE
                        uid = 1
                ) AND hw_homework.cid NOT IN(
                    SELECT
                        cid
                    FROM
                        hw_done
                    WHERE
                        uid = 1
                ) AND hw_homework.due > CURRENT_TIME
                 */
                var CurrentPage = req.body.page ? parseInt(req.body.page) : 1;
                var NumbersPerPage = req.body.limit ? parseInt(req.body.limit) : 20;
                var Start = CurrentPage * NumbersPerPage - NumbersPerPage;
                var sql = 'SELECT\n' +
                    '    hw_homework.id as kid,\n'+
                    '    hw_homework.cid,\n' +
                    '    hw_homework.title,\n' +
                    '    hw_homework.description,\n' +
                    '    hw_homework.due,\n' +
                    '    hw_course.courseid,\n' +
                    '    hw_course.term,\n' +
                    '    hw_course.instructor,\n' +
                    '    hw_course.instructor,\n' +
                    '    hw_course.class,\n' +
                    '    hw_course.name,\n' +
                    '    hw_course.logo\n' +
                    'FROM\n' +
                    '    hw_homework\n' +
                    'LEFT JOIN hw_course ON hw_homework.cid = hw_course.id\n' +
                    'WHERE\n' +
                    '    hw_homework.cid IN(\n' +
                    '    SELECT\n' +
                    '        cid\n' +
                    '    FROM\n' +
                    '        hw_follow\n' +
                    '    WHERE\n' +
                    '        uid = ?\n' +
                    ') AND hw_homework.cid NOT IN(\n' +
                    '    SELECT\n' +
                    '        cid\n' +
                    '    FROM\n' +
                    '        hw_done\n' +
                    '    WHERE\n' +
                    '        uid = ?\n' +
                    ') AND hw_homework.due > CURRENT_TIME ' +
                    'ORDER BY hw_homework.due desc limit ?,?';
                var params = [req.body.uid, req.body.uid, Start, NumbersPerPage];

                return QueryMySQL(sql, params);
            }
        )
        .then(
            function (result) {
                for (let n = 0; n < result.length; ++n) {
                    result[n].due = new Date(+result[n].due /* + 8 * 3600 * 1000 */)
                        .toISOString().replace(/T/g, ' ')
                        .replace(/\.[\d]{3}Z/, '')
                }
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
                var sql = 'SELECT\n' +
                    '    hw_homework.id as kid,\n'+
                    '    hw_homework.cid,\n' +
                    '    hw_homework.title,\n' +
                    '    hw_homework.description,\n' +
                    '    hw_homework.due,\n' +
                    '    hw_course.courseid,\n' +
                    '    hw_course.term,\n' +
                    '    hw_course.instructor,\n' +
                    '    hw_course.instructor,\n' +
                    '    hw_course.class,\n' +
                    '    hw_course.name,\n' +
                    '    1 as done,\n' +
                    '    hw_course.logo\n' +
                    'FROM\n' +
                    '    hw_homework\n' +
                    'LEFT JOIN hw_course ON hw_homework.cid = hw_course.id\n' +
                    'WHERE\n' +
                    '    hw_homework.cid IN(\n' +
                    '    SELECT\n' +
                    '        cid\n' +
                    '    FROM\n' +
                    '        hw_follow\n' +
                    '    WHERE\n' +
                    '        uid = ?\n' +
                    ') AND hw_homework.cid IN(\n' +
                    '    SELECT\n' +
                    '        cid\n' +
                    '    FROM\n' +
                    '        hw_done\n' +
                    '    WHERE\n' +
                    '        uid = ?\n' +
                    ') \n' +
                    'ORDER BY hw_homework.due desc limit ?,?';
                var params = [req.body.uid, req.body.uid, Start, NumbersPerPage];

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
                var sql = 'SELECT\n' +
                    '    hw_homework.id as kid,\n'+
                    '    hw_homework.cid,\n' +
                    '    hw_homework.title,\n' +
                    '    hw_homework.description,\n' +
                    '    hw_homework.due,\n' +
                    '    hw_course.courseid,\n' +
                    '    hw_course.term,\n' +
                    '    hw_course.instructor,\n' +
                    '    hw_course.instructor,\n' +
                    '    hw_course.class,\n' +
                    '    hw_course.name,\n' +
                    '    hw_course.logo\n' +
                    'FROM\n' +
                    '    hw_homework\n' +
                    'LEFT JOIN hw_course ON hw_homework.cid = hw_course.id\n' +
                    'WHERE\n' +
                    '    hw_homework.cid IN(\n' +
                    '    SELECT\n' +
                    '        cid\n' +
                    '    FROM\n' +
                    '        hw_follow\n' +
                    '    WHERE\n' +
                    '        uid = ?\n' +
                    ') AND hw_homework.cid NOT IN(\n' +
                    '    SELECT\n' +
                    '        cid\n' +
                    '    FROM\n' +
                    '        hw_done\n' +
                    '    WHERE\n' +
                    '        uid = ?\n' +
                    ') AND hw_homework.due < CURRENT_TIME ' +
                    'ORDER BY hw_homework.due desc limit ?,?';
                var params = [req.body.uid, req.body.uid, Start, NumbersPerPage];

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