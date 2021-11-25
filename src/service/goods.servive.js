const connection = require("../app/database");

class GoodsServive {
  async list(offset, size, params) {
    try {
      if (params) {
        let statement = `SELECT * FROM product WHERE`;
        let paramCount = 0;
        for (let p in params) {
          if (p === "name" || p === "address") {
            params[p] = params[p] || "";
            statement += ` ${p} LIKE '%${params[p]}%' AND`;
            paramCount++;
          } else if (p === "status") {
            if (!params[p] && params[p] !== 0) params[p] = 1;
            statement += ` status = ${params[p]} AND`;
            paramCount++;
          } else if (p === "createAt") {
            if (!params[p]) break;
            statement += ` (UNIX_TIMESTAMP(createAt)-8*60*60) BETWEEN 
            UNIX_TIMESTAMP('${params[p][0]}') AND 
            UNIX_TIMESTAMP('${params[p][1]}')       `;
            paramCount++;
          }
        }
        if (!paramCount) {
          statement = statement.replace("WHERE", "");
        } else if (paramCount >= 1) {
          statement = statement.substring(0, statement.length - 4);
        }
        const [result] = await connection.execute(statement);
        return result;
      } else {
        // 不加筛选条件的查询
        offset = offset || 0;
        size = size || 10000;
        const statement = `SELECT * FROM product LIMIT ${offset},${size} `;
        const [result] = await connection.execute(statement);
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async totalCount() {
    const statement = `SELECT count(*) totalCount FROM product LiMIT 0,10000`;
    const [result] = await connection.execute(statement);
    return result[0].totalCount;
  }
  async getCategoryCount() {
    const statement = `SELECT id, name, count goodsCount FROM category`;
    const [result] = await connection.execute(statement);
    return result;
  }
  async getCategorySale() {
    const statement = `SELECT id, name, sale goodsCount FROM category`;
    const [result] = await connection.execute(statement);
    return result;
  }
  async getCategoryFavor() {
    const statement = `SELECT id, name, favor goodsFavor FROM category`;
    const [result] = await connection.execute(statement);
    return result;
  }
  async getAddressSale() {
    const statement = `SELECT address, count FROM address`;
    const [result] = await connection.execute(statement);
    return result;
  }
}

module.exports = new GoodsServive();
