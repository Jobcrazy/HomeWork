var QueryMySQL = require('./database').QueryMySQL;

var Utils = {
    checkUser: function (gid, token) {
        return new Promise(function (resolve, reject) {
            var sql = 'SELECT id FROM hw_user WHERE gid = ? AND token = ?';
            var params = [gid, token];

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
    checkAdmin: function (gid, token) {
        return new Promise(function (resolve, reject) {
            var sql = 'SELECT id FROM hw_user WHERE gid = ? AND token = ?';
            var params = [gid, token];

            QueryMySQL(sql, params)
                .then(
                    function (result) {
                        if (result.length){
                            var sql = `SELECT id FROM hw_admin WHERE uid = ?`;
                            var params = [result[0].id];
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
    }
}

module.exports = Utils;