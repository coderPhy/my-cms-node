const connecton = require("../app/database");

class StoryService {
  async create(userId, title, content) {
    const statement = `INSERT INTO story (user_id, title, content) VALUES(?,?,?)`;
    const result = await connecton.execute(statement, [userId, title, content]);
    return result;
  }
  async list(offset, size) {
    const statement = `SELECT (SELECT name FROM user where id = s.user_id) userName,
     s.title title, s.content content, 
    s.createAt createAt  FROM story s LIMIT ${offset}, ${size}`;
    const [result] = await connecton.execute(statement);
    return result;
  }
}

module.exports = new StoryService();
