# MySQL database setup for benchmarks

A collection of scripts used to streamline the creation and the population of MySQL databases for testing purposes.

These scripts were designed to create and populate databases with a large number of records (order of >1M).

Data is first generated using faker package and saved to a `.csv` file (1M records generated in <1min - depending on the record size). This file is then used to populate the database.

Node.js is required to run the scripts.

## Scripts

Run the scripts below in order to get started.

### 1. Create and start a MySQL database in a container

`docker compose up`

This creates MySQL database and runs all the SQL commands in `init.sql` file. The commands are used to create initial tables where the generated data will be stored.

### 2. Generate users

`node generateUsers.js $userNumber`

Generates `$userNumber` number of unique users and stores them in a `users.csv` file. By default `$userNumber = 1,000,000`.

### 3. Populate the database with the generated data

`node index.js`

Populates the database with the data found in `users.csv`.

### Additional script: delete all database records

`node index.js clear`

Deletes all records in the database and truncates the table. 