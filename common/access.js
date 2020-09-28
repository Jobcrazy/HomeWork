var QueryMySQL = require('./database').QueryMySQL;

var Utils = {
    checkUser: function (id, token) {
        return new Promise(function (resolve, reject) {
            var sql = 'SELECT id FROM hw_user WHERE id = ? AND token = ?';
            var params = [id, token];

            QueryMySQL(sql, params)
                .then(
                function (result) {
                    if (result.length){
                        resolve(result)
                    }else{
                        var err = {
                            message: "No such user"
                        }
                        reject(err)
                    }
                })
                .catch(
                    function (err) {
                        reject(err);
                    }
                )
        })
    },
    checkAdmin: function (id, token) {
        return new Promise(function (resolve, reject) {
            var sql = 'SELECT id FROM hw_user WHERE id = ? AND token = ?';
            var params = [id, token];

            QueryMySQL(sql, params)
                .then(
                    function (result) {
                        if (result.length){
                            var sql = `SELECT id FROM hw_admin WHERE uid = ?`;
                            var params = [id];
                            QueryMySQL(sql, params)
                                .then(
                                    function (result) {
                                        if (result.length) {
                                            //Is Administrotor
                                            resolve(result)
                                        }else{
                                            var err = {
                                                message: "No Access"
                                            }
                                            reject(err)
                                        }
                                    })
                                .catch(
                                    function (err) {
                                        reject(err);
                                    }
                                )
                        }else{
                            var err = {
                                message: "No such user"
                            }
                            reject(err)
                        }
                    })
                .catch(
                    function (err) {
                        reject(err);
                    }
                )
        })
    },
    checkVolunteer: function (cid, uid, token) {
        return new Promise(function (resolve, reject) {
            var sql = 'SELECT id FROM hw_user WHERE id = ? AND token = ?';
            var params = [uid, token];

            QueryMySQL(sql, params)
                .then(
                    function (result) {
                        if (result.length){
                            var sql = `SELECT id FROM hw_volunteer WHERE cid = ? AND vid = ?`;
                            var params = [cid, uid];
                            QueryMySQL(sql, params)
                                .then(
                                    function (result) {
                                        if (result.length) {
                                            resolve(result)
                                        }else{
                                            var err = {
                                                message: "No Access"
                                            }
                                            reject(err)
                                        }
                                    })
                                .catch(
                                    function (err) {
                                        reject(err);
                                    }
                                )
                        }else{
                            var err = {
                                message: "No such user"
                            }
                            reject(err)
                        }
                    })
                .catch(
                    function (err) {
                        reject(err);
                    }
                )
        })
    }
}

module.exports = Utils;