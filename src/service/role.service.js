const connection = require("../app/database");

class RoleService {
  async create(name, intro, menuList) {
    if (!menuList.length) return;
    const statement = `
      INSERT INTO role (name, intro) VALUES(?,?)
    `;
    const [result] = await connection.execute(statement, [name, intro]);
    const roleId = result.insertId;
    // 从statement执行的结果想办法拿到roleId
    for (let menuId of menuList) {
      const [addResult] = await this.addRoleMenu(roleId, menuId);
      if (!addResult) return;
    }
    return result;
  }
  async remove(roleId) {
    const statement = `DELETE FROM role WHERE id = ?`;
    const result = await connection.execute(statement, [roleId]);
    return result[0];
  }
  async addRoleMenu(roleId, menuId) {
    const statement = `
      INSERT INTO role_menu (role_id, menu_id) VALUES (?,?)
    `;
    const result = await connection.execute(statement, [roleId, menuId]);
    return result;
  }
  async edit(roleId, name, intro, menuList) {
    try {
      const statement = `UPDATE role set name=?, intro=?  WHERE id = ?`;
      const [result] = await connection.execute(statement, [
        name,
        intro,
        roleId,
      ]);
      const statement2 = `DELETE FROM role_menu WHERE role_id = ?`;
      const [result2] = await connection.execute(statement2, [roleId]);
      const statement3 = `INSERT INTO role_menu (role_id, menu_id) VALUES(?,?)`;
      let result3;
      for (let i = 0; i < menuList.length; i++) {
        [result3] = await connection.execute(statement3, [roleId, menuList[i]]);
      }
      return result3 && result2 && result;
    } catch (error) {
      console.log(error);
    }
  }
  async get(roleId) {
    const statement = `SELECT * FROM role WHERE id = ?`;
    const [result] = await connection.execute(statement, [roleId]);
    return result[0];
  }
  async list(offset, size, intro, name, createAt) {
    let queryParams = [
      { key: "intro", value: intro },
      { key: "name", value: name },
      { key: "createAt", value: createAt },
    ];
    if (!(intro || name || createAt)) {
      const statement = `SELECT * FROM role LIMIT ${offset},${size}`;
      const [result] = await connection.execute(statement);
      return result;
    } else {
      let statement = `SELECT * FROM role WHERE `;
      queryParams = queryParams.map((item) => {
        return item.value ? item : false;
      });
      for (let i = 0; i < queryParams.length; i++) {
        if (i <= 1 && queryParams[i]) {
          statement += ` ${queryParams[i].key} LIKE '%${queryParams[i].value}%'  AND`;
        }
      }
      if (createAt) {
        statement += ` (UNIX_TIMESTAMP(createAt)-8*60*60) BETWEEN  UNIX_TIMESTAMP('${createAt[0]}') AND  UNIX_TIMESTAMP('${createAt[1]}')`;
      } else {
        statement = statement.substring(0, statement.length - 4);
      }
      try {
        const [result] = await connection.execute(statement);
        return result;
      } catch (error) {
        console.log(error);
      }
    }
  }
  async totalCount(offset, size) {
    const statement = `SELECT count(*) totalCount FROM role LIMIT ${offset},${size}`;
    const [count] = await connection.execute(statement);
    return count[0].totalCount;
  }
  async getMenuByRoleId(roleId) {
    const statement = `
      SELECT m.* FROM role_menu rm 
      LEFT JOIN menu m ON m.id = rm.menu_id
      WHERE rm.role_id = ?
    `;
    const [result] = await connection.execute(statement, [roleId]);
    return result;
  }
}

module.exports = new RoleService();
