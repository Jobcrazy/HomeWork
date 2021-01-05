var config = require('config');
var mysql = require('mysql');
var connection = null;

module.exports.QueryMySQL = function () {
    var local_arguments = arguments;

    return new Promise(function (resolve, reject) {
        if (!connection) {
            var config_mysql = config.get((process.env.DATABASE || 'homework') + '.db.mysql');
            connection = mysql.createPool({
                host: config_mysql.host,
                user: config_mysql.user,
                password: config_mysql.password,
                database: config_mysql.database,
                connectionLimit: config_mysql.max_connections,
                multipleStatements: config_mysql.multipleStatements
            });
            console.log('MySQL Pool Have Been Inited.')
        }

        if (local_arguments.length !== 1 && local_arguments.length !== 2) {
            return reject('Wrong arguments number');
        }

        var sql = local_arguments[0];
        var params = local_arguments[1];
        if (typeof (params) !== 'object') {
            connection.query(sql, function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            });
        } else {
            connection.query(sql, params, function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            });
        }
    });
}