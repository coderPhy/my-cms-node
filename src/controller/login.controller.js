const jwt = require("jsonwebtoken");
const config = require("../app/config");

class LoginController {
  async login(ctx, next) {
    try {
      const { id, name } = ctx.user;
      const token = jwt.sign({ id, name }, config.PRIVATE_KEY, {
        expiresIn: 60 * 60 * 24,
        algorithm: "RS256",
      });
      ctx.body = {
        code: 0,
        // statusCode: 200,
        // errorMessge: null,
        data: {
          id,
          name,
          token,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new LoginController();
