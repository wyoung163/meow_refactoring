// //mysql 
// const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//   host: "127.0.0.1",
//   port: "3306",
//   user: "root",
//   password: "PleaseBetter11",
//   database: "meow",
//   connectionLimit: 50,
//   waitForConnections: true,
//   insecureAuth: true
// });

// module.exports = pool;

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "35.232.161.189",
  port: "3306",
  user: "teamtwo",
  password: "password",
  database: "meow",
  dateStrings: "date",
});

module.exports = pool;