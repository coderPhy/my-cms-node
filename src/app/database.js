const mysql = require("mysql2");
const config = require("./config");

const connections = mysql.createPool({
  host: config.MYSQL_HOST,
  post: config.MYSQL_PORT,
  database: config.MYSQL_DATABASE,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
});

connections.getConnection((err, conn) => {
  conn.connect((err) => {
    if (err) {
      console.log("连接失败");
    } else {
      console.log("连接成功");
    }
  });
});

module.exports = connections.promise();
