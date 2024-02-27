const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'secret', 
  database: 'test'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MariaDB!');
});

module.exports = connection;
