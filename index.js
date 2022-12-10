import fs from 'fs';
import mysql from "mysql2";

// === Helper functions ========================================================

function connectToDB(connection) {
  connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
  });

  connection.query(`USE mysql_bench_db;`, (err, result) => {
    if (err) throw err;
    console.log("Selected appropriate DB");
  });

  connection.query(`SET GLOBAL local_infile = TRUE;`, (err) => {
    if (err) throw err;
    console.log("Set local_infile variable");
  })
}

function clearDB(c, callback) {
  c.query(`DELETE FROM friendships;`, (err, result) => {
    if (err) throw err;
    console.log('Deleted all rows from the users table.')
  });

  c.query(`TRUNCATE friendships;`, (err, result) => {
    if (err) throw err;
    console.log('Truncated the users table.');
    c.end();
    callback();
  });
}

function populateDB(connection, fileName, tableName, callback) {
  connection.query({
    sql: `LOAD DATA LOCAL INFILE './${fileName}'
      INTO TABLE ${tableName}
      FIELDS TERMINATED by \',\'
      LINES TERMINATED BY \'\n\'
      IGNORE 1 LINES`,
    infileStreamFactory: () => fs.createReadStream(`./${fileName}`)
  },
  (err, result) => {
    if (err) throw err;
    console.log('Data successfully populated.');
    callback();
  })
}

// === Running the program ====================================================

const mysql_host = "localhost";
const mysql_username = "root";
const mysql_password = "password";

// Connecting to the database
const con = mysql.createConnection({
  host: mysql_host, 
  user: mysql_username, 
  password: mysql_password, 
  flags: ['+LOCAL_FILES']
});
connectToDB(con);

// Check if we're clearing the database
const clearArg = process.argv[2] === 'clear';
if (clearArg) { 
  clearDB(con, () => {
    con.end();
    process.exit();
  });
}

console.log(`=== Populating the database ===`);

populateDB(con, 'relations.csv', 'friendships', () => process.exit());