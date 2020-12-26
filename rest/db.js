const mysql = require('mysql')

connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'PepeLePew7',
    database: 'task'
});

/*** Usuarios */

module.exports.login = function (username, password, callback) {
    if (connection) {
        connection.query('SELECT * from users WHERE username=? AND password=?', [username, password], (err, rows) => {
            if (err) {
                throw err
            } else {
                if (rows.length){
                    //callback(rows[0])

                    // gestion de token usuario
                    const user_id = rows[0].id
                    const ran = Math.random().toString(36).substring(7)

                    // borrar todos los tokens del usuario
                    connection.query('DELETE FROM user_tokens WHERE user_id = ?', user_id)

                    const dataToken = {
                        token: ran,
                        user_id: user_id
                    }

                    // generar nuevo token
                    connection.query('INSERT INTO user_tokens SET ?', dataToken, (err, results, fields) => {
                        if (err) {
                            throw err
                        } else {
                            callback({
                                'token': ran
                            })
                        }
                    })

                }else
                    callback({})
            }
        })
    }
}
module.exports.logout = function (token) {
    if (connection) {
        connection.query('DELETE FROM user_tokens WHERE token = ?', token)
    }
}

module.exports.getUserToken = function (user_id, callback) {
    if (connection) {
        connection.query('SELECT * from user_tokens WHERE user_id=?', user_id, (err, rows) => {
            if (err) {
                throw err
            } else {
                if (rows.length)
                    callback(rows[0])
                else
                    callback({})
            }
        })
    }
}

module.exports.getInfoUserByToken = function (token, callback) {
    if (connection) {
        connection.query('SELECT u.* FROM user_tokens ut JOIN users as u ON u.id = ut.user_id WHERE ut.token = ?', token, (err, rows) => {
            if (err) {
                throw err
            } else {
                if (rows.length)
                    callback(rows[0])
                else
                    callback({})
            }
        })
    }
}

/*** tareas */

module.exports.getTasks = function (callback) {
    if (connection) {
        connection.query('SELECT * from tasks', (err, rows) => {
            if (err) {
                throw err
            } else {
                callback(rows)
            }
        })
    }
}

module.exports.getTask = function (id, callback) {
    if (connection) {
        connection.query('SELECT * from tasks WHERE id=?', id, (err, rows) => {
            if (err) {
                throw err
            } else {
                if (rows.length)
                    callback(rows[0])
                else
                    callback({})
            }
        })
    }
}

module.exports.insertTask = function (dataTask, callback) {
    if (connection) {
        connection.query('INSERT INTO tasks SET ?', dataTask, (err, results, fields) => {
            if (err) {
                throw err
            } else {
                callback({
                    'id': results.insertId
                })
            }
        })
    }
}

module.exports.updateTask = function (id, dataTask, callback) {
    if (connection) {
        connection.query('UPDATE tasks SET ? WHERE id = ?', [dataTask, id], (err, results, fields) => {
            if (err) {
                throw err
            } else {
                callback({
                    'id': id
                })
            }
        })
    }
}

module.exports.deleteTask = function (id, callback) {
    if (connection) {
        connection.query('DELETE FROM tasks WHERE id = ?', id , (err, results, fields) => {
            if (err) {
                throw err
            } else {
                callback({
                    'id': id
                })
            }
        })
    }
}