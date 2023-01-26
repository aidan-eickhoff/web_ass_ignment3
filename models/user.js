const mysql = require("mysql");
class User {
    #connection;

    constructor(host, user, password, database) {
        this.#connection = mysql.createConnection({
            host,
            user,
            password,
            database
        });
    }

    async selectActiveUsers() {
        let result;
        await this.#connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
            if (!err) {
                // console.log(rows);
                result = rows;
            } else {
                console.log(err);
            }
        });

        while(result === undefined) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        //console.log('done timeout');
        return result;
    }

    async searchUsers(searchTerm) {
        let result;
        this.#connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            if (!err) {
                result =  rows;
            } else {
                console.log(err);
            }
        });

        while(result === undefined) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        //console.log('done timeout');
        return result;
    }

    createUser(first_name, last_name, email, phone, comments) {
        this.#connection.query(
            'INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
            if (err) {
                console.log(err);
            }
        });
    }

    async editUser(id) {
        let result;
        this.#connection.query('SELECT * FROM user WHERE id = ?', [id], (err, rows) => {
            if (!err) {
                result = rows;
            } else {
                console.log(err);
            }
        });

        while(result === undefined) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        //console.log('done timeout');
        return result;
    }

    async updateUser(first_name, last_name, email, phone, comments, id) {
        let result;
        this.#connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, id], (err, rows) => {
            if (!err) {
                this.#connection.query('SELECT * FROM user WHERE id = ?', [id], (err, rows) => {
                    if (!err) {
                        result = rows;
                        //res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
            }
        });

        while(result === undefined) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        //console.log('done timeout');
        return result;
    }

    async deleteUser(id) {
        let result;
        this.#connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', id], (err, rows) => {
            if (!err) {
                this.#connection.query('SELECT first_name FROM user WHERE id = ?', [id], (error, row) => {
                    result = JSON.parse(JSON.stringify(row))[0].first_name;
                });
            } else {
                console.log(err);
            }
        });

        while(result === undefined) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        //console.log('done timeout');
        return result;
    }

    async viewUser(id) {
        let result;
        this.#connection.query('SELECT * FROM user WHERE id = ?', [id], (err, rows) => {
            if (!err) {
                result =  rows;
            } else {
                console.log(err);
            }
        });

        while(result === undefined) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        return result;
    }
}

module.exports = User;
