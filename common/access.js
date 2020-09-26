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
    }
}

module.exports = Utils;