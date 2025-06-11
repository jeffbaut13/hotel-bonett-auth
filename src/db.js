const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",      // Cambia por tu usuario de MySQL
  password: "", // Cambia por tu password
  database: "hotel_sistema", // Nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { pool };
