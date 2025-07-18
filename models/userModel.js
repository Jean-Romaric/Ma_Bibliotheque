// models/userModel.js
const db = require('../config/db'); // connexion MySQL

const getAllUsers = (callback) => {
    const sql = 'SELECT * FROM Utilisateur';
    db.query(sql, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
        console.log(null);
    });
};

module.exports = {
    getAllUsers
};
