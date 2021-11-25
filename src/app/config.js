const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const PUBLIC_KEY_URL = path.resolve(__dirname, "./keys/public.key");
const PRIVATE_KEY_URL = path.resolve(__dirname, "./keys/private.key");
let PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_URL);
let PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_URL);

dotenv.config();

module.exports = {
  APP_HOST,
  APP_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
} = process.env;

module.exports.PUBLIC_KEY = PUBLIC_KEY;
module.exports.PRIVATE_KEY = PRIVATE_KEY;
