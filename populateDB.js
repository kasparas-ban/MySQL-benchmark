import fs from 'fs';
import mysql from "mysql2";

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

con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

con.query(`USE mysql_bench_db;`, (err, result) => {
  if (err) throw err;
  console.log("Selected appropriate DB");
});

con.query({
    sql: `LOAD DATA LOCAL INFILE './relations.csv'
      INTO TABLE friendships
      FIELDS TERMINATED by \',\'
      LINES TERMINATED BY \'\n\'
      IGNORE 1 LINES`,
    infileStreamFactory: () => fs.createReadStream('./relations.csv')
  },
  (err, result) => {
    console.log(err);
    if (err) throw err;
    console.log('Data successfully populated.');
    process.exit();
  })