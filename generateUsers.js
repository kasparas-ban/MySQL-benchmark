import {faker} from "@faker-js/faker";
import fs from 'fs';

// === Faker data generation ============================================================================

const getUsername = () => faker.helpers.unique(faker.internet.userName);
const getEmail = () => faker.helpers.unique(faker.internet.email);
const getPassword = () => faker.internet.password(getRandomInt(10, 30), getRandomMem());

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function getRandomMem() {
  return Math.random() > 0.5;
}

// === File data writing ================================================================================

function createWriteStream(filename) {
  const writeStream = fs.createWriteStream(filename);
  writeStream.write('id,username,email,password\n', 'utf8');
  return writeStream;
}

function writeUsers(numUsers, writer, encoding, callback) {
  let i = numUsers;
  let id = 0;
  function write() {
    let ok = true;
    do {
      i -= 1;
      id += 1;
      // const avatar = faker.image.avatar();
      const username = getUsername();
      const email = getEmail();
      const password = getPassword();
      const data = `,${username},${email},${password}\n`;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write()
}

// === Run the program ===================================================================================

const numUsers = parseInt(process.argv[2]) || 1000000;
const filename = 'users.csv';
const writeStream = createWriteStream(filename); 

console.log(`=== Generating ${numUsers} users ===`);

writeUsers(numUsers, writeStream, 'utf-8', () => {
  writeStream.end();
  process.exit();
});