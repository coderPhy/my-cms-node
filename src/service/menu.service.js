const connection = require("../app/database");

class MenuService {
  async get(menuId) {
    const statement = `SELECT * FROM menu WHERE id = ?`;
    const [result] = await connection.execute(statement, [menuId]);
    return result[0];
  }
  async list() {
    try {
      const statement = `SELECT * FROM menu LiMIT 0,10000`;
      const [result] = await connection.execute(statement);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async totalCount() {
    const statement = `SELECT COUNT(*) totalCount FROM menu `;
    const [result] = await connection.execute(statement);
    return result[0];
  }
}

module.exports = new MenuService();
