const connection = require("../app/database");

class DepartmentService {
  async create(name, leader) {
    try {
      const statement = `
      INSERT INTO DEPARTMENT (name, leader) VALUES (?,?)
    `;
      const [result] = await connection.execute(statement, [name, leader]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async remove(departmentId) {
    const statement = ` DELETE FROM department WHERE id = ?`;
    const result = await connection.execute(statement, [departmentId]);
    return result[0];
  }
  async edit(leader, name, departmentId) {
    try {
      const { oldLeader, oldName } = await this.getDepartmentById(departmentId);
      leader = leader || oldLeader;
      name = name || oldName;
      const statement = ` UPDATE department SET leader = ?, name = ? WHERE id = ?`;
      const [result] = await connection.execute(statement, [
        leader,
        name,
        departmentId,
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async getDepartmentById(id) {
    const statement = `SELECT * FROM department WHERE id = ?`;
    const [result] = await connection.execute(statement, [id]);
    return result[0];
  }
  async list(offset, size) {
    offset = offset || 0;
    size = size || 1000;
    const statement = `SELECT * FROM department LIMIT ${offset},${size};`;
    const [result] = await connection.execute(statement);
    return result;
  }
  async totalCount(offset, size) {
    offset = offset || 0;
    size = size || 10000;
    const statement = `SELECT COUNT(*) totalCount FROM department LIMIT ${offset},${size};`;
    const [result] = await connection.execute(statement);
    return result[0];
  }
}

module.exports = new DepartmentService();
