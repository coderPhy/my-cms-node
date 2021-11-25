const connection = require("../app/database");
const md5password = require("../utils/handle-password");

class UserService {
  async create(
    name,
    realname,
    password,
    cellphone,
    avatar_url,
    department_id,
    role_id
  ) {
    try {
      const statement = `
        INSERT INTO user(name, realname, password, cellphone, avatar_url,
          department_id, role_id, enable) VALUES(?, ?, ?, ?, ?, ?, ?, 1)
      `;
      const result = await connection.execute(statement, [
        name,
        realname,
        password,
        cellphone,
        avatar_url || null,
        department_id,
        role_id,
      ]);
      return result[0];
    } catch (error) {
      return undefined;
    }
  }
  async remove(userId) {
    const statement = `DELETE FROM USER WHERE id = ?`;
    const result = await connection.execute(statement, [userId]);
    return result[0];
  }
  async edit(user, userId) {
    const {
      name,
      realname,
      password,
      cellphone,
      avatar_url,
      roleId,
      departmentId,
    } = user;

    try {
      const oldUserMessage = await this.getUserByParams(null, null, userId);
      const statement = `
        UPDATE user SET name=?, realname=?, password=?,
        cellphone=?,avatar_url=?, role_id=?, department_id=?
        WHERE id = ?
      `;
      const result = await connection.execute(statement, [
        name ? name : oldUserMessage.name,
        realname ? realname : oldUserMessage.realname,
        password ? md5password(String(password)) : oldUserMessage.password,
        cellphone ? cellphone : oldUserMessage.cellphone,
        avatar_url ? avatar_url : oldUserMessage.avatar_url,
        roleId ? roleId : oldUserMessage.role_id,
        departmentId ? departmentId : oldUserMessage.department_id,
        userId,
      ]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }
  async get(userId) {
    try {
      const statement = `
      SELECT 
        u.id id, u.name name, u.realname realname, u.cellphone cellphone, u.enable enable,
        u.createAt createAt, u.updateAt updateAt, JSON_OBJECT(
          "id", r.id, "name", r.name, "intro", r.intro, 
          "createAt", r.createAt, "updateAt", r.updateAt
        ) role, JSON_OBJECT(
          "id", d.id, "name", d.name, "parentId", d.parentId,
          "createAt", d.createAt, "updateAt", d.updateAt
        ) department
      FROM user u 
      LEFT JOIN role r ON u.role_id = r.id
      LEFT JOIN department d ON u.department_id = d.id
      WHERE u.id =?
      `;
      const [result] = await connection.execute(statement, [userId]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }
  async list(offset, size, newQueryArr) {
    newQueryArr = newQueryArr || [];
    try {
      if (newQueryArr.length) {
        // 按条件查询并且分页
        let statement = `
        SELECT
          u.id, u.name, u.realname, u.cellphone, u.avatar_url, u.role_id roleId,
          u.department_id departmentId, u.enable, u.createAt, u.updateAt
        FROM user u 
        WHERE     
        `;
        newQueryArr.forEach((item) => {
          if (item.type === "number" && item.value !== "") {
            statement += ` ${item.text}=${item.value}  AND `;
          } else if (item.type === "string" && item.value !== "") {
            statement += `${item.text} LIKE '%${item.value}%'  AND `;
          } else if (item.type === "time" && item.value !== "") {
            statement += `(UNIX_TIMESTAMP(u.createAt)-8*60*60) 
            BETWEEN UNIX_TIMESTAMP('${item.value[0]}')
             AND UNIX_TIMESTAMP('${item.value[1]}')    `;
          }
        });
        if (!newQueryArr.length) statement.replace("WHERE", "");
        statement = statement.substring(0, statement.length - 4);
        statement += ` LIMIT 0, 10000`;
        const [result] = await connection.execute(statement);
        return result;
      } else {
        // 分页
        const statement = `
        SELECT
          u.id, u.name, u.realname, u.cellphone, u.avatar_url, u.role_id roleId,
          u.department_id departmentId, u.enable, u.createAt, u.updateAt
        FROM user u
        LIMIT ${offset},${size}`;
        const [result] = await connection.execute(statement);
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async totalCount() {
    try {
      const statement = `SELECT count(id) totalCount FROM user;`;
      const [result] = await connection.execute(statement);
      return result[0].totalCount;
    } catch (error) {
      console.log(error);
    }
  }
  async getUserByParams(name, realname, userId) {
    if (userId) {
      try {
        const statement = `SELECT * FROM user WHERE id = ?`;
        const [result] = await connection.execute(statement, [userId]);
        return result[0];
      } catch (error) {
        console.log(error);
      }
    } else if (realname) {
      try {
        const statement = `SELECT * FROM user WHERE realname = ?`;
        const [result] = await connection.execute(statement, [realname]);
        return result.length >= 2;
      } catch (error) {
        console.log(error);
      }
    } else {
      const statement = `SELECT * FROM user WHERE name = ?`;
      const [result] = await connection.execute(statement, [name]);
      return result[0];
    }
  }
  async isExistsByRealName(userId, realname) {
    if (!realname) return;
    const statement = `SELECT * FROM user WHERE id != ? AND realname = ?;`;
    const [result] = await connection.execute(statement, [userId, realname]);
    return !!result.length;
  }
}

module.exports = new UserService();
