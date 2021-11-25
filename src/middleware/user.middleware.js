const userService = require("../service/user.service");
const errorTypes = require("../constants/error-types");
const md5password = require("../utils/handle-password");

const verifyUser = async (ctx, next) => {
  // 1. 获取用户信息
  const { name, password, realname, departmentId, roleId } = ctx.request.body;
  // 2. 判断参数不为空
  if (!name || !password || !realname || !departmentId || !roleId) {
    const error = new Error(
      errorTypes.USERNAME_PASSWORD_REALNAME_DEPARTMENTID_ROLEID_IS_NOT_NULL
    );
    return ctx.app.emit("error", error, ctx);
  }

  // 3.判断注册用户名是否已经存在
  const user = await userService.getUserByParams(name, realname);
  if (user) {
    const error = new Error(errorTypes.USER_OR_REALNAME_IS_EXiSTS);
    return ctx.app.emit("error", error, ctx);
  }

  await next();
};

const handlePassword = async (ctx, next) => {
  // 对密码进行加密
  const { password } = ctx.request.body;
  ctx.request.body.password = md5password(md5password(password));

  await next();
};
module.exports = {
  verifyUser,
  handlePassword,
};
