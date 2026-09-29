const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'senai2025', 
    database: 'LojaConstrucao',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = connection;