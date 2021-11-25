const connection = require("../app/database");

class LoginService {
  async login(name, password) {
    const stateMent = `
        SELECT id, name, createAt, updateAt FROM user WHERE name = ? AND password = ?; 
    `;
    const [result] = await connection.execute(stateMent, [name, password]);
    return result[0];
  }
}

module.exports = new LoginService();
