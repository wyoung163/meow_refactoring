const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
    port: process.env.SERVER_PORT,
    connectionLimit: 50,
    waitForConnections: true,
    insecureAuth: true
});

module.exports = pool;