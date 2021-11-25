const jwt = require("jsonwebtoken");
const config = require("../app/config");
const errorTypes = require("../constants/error-types");
const userService = require("../service/user.service");
const md5password = require("../utils/handle-password");

// 验证token
const verifyAuth = async (ctx, next) => {
  try {
    const authorization = ctx.request.header.authorization;
    if (!authorization) {
      const error = new Error(errorTypes.UNAUTHORIZATION);
      return ctx.app.emit("error", error, ctx);
    }

    const token = authorization.replace("Bearer ", "");
    try {
      const result = jwt.verify(token, config.PUBLIC_KEY, {
        algorithms: ["RS256"],
      });
      const user = {
        id: result.id,
        name: result.name,
      };
      ctx.user = user;
      await next();
    } catch (error) {
      return ctx.app.emit("error", new Error(errorTypes.UNAUTHORIZATION), ctx);
    }
  } catch (error) {
    console.log(error);
  }
};

// 登录验证
const verifyLogin = async (ctx, next) => {
  try {
    // 1.获取用户名和密码
    const { name, password } = ctx.request.body;
    // 2.判断用户名跟密码不为空
    if (!name || !password) {
      const error = new Error(errorTypes.USERNAME_OR_PASSWORD_IS_NOT_NULL);
      return ctx.app.emit("error", error, ctx);
    }
    // 3.判断用户是否存在
    const user = await userService.getUserByParams(name);
    if (!user) {
      const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
      return ctx.app.emit("error", error, ctx);
    }
    // 4. 判断密码是否正确
    if (user.password !== md5password(md5password(password))) {
      const error = new Error(errorTypes.PASSWORD_IS_ERROR);
      return ctx.app.emit("error", error, ctx);
    }
    ctx.user = user;
    await next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  verifyAuth,
  verifyLogin,
};
