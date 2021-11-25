const errorTypes = require("../constants/error-types");

module.exports = function (err, ctx) {
  let status, message;
  switch (err.message) {
    case errorTypes.USERNAME_PASSWORD_REALNAME_DEPARTMENTID_ROLEID_IS_NOT_NULL: {
      status = 403;
      message = "用户名,密码,真实姓名,部门id,角色id都不能为空...";
      break;
    }
    case errorTypes.USER_DOES_NOT_EXISTS: {
      status = 403;
      message = "用户不存在...";
      break;
    }
    case errorTypes.PASSWORD_IS_ERROR: {
      status = 403;
      message = "密码错误...";
      break;
    }
    case errorTypes.USER_OR_REALNAME_IS_EXiSTS: {
      status = 403;
      message = "用户名或者真实姓名已经存在...";
      break;
    }
    case errorTypes.REALNAME_IS_EXiSTS: {
      status = 403;
      message = "真实姓名已经存在...";
      break;
    }
    case errorTypes.UNAUTHORIZATION: {
      status = 401;
      message = "无效的token~";
      break;
    }
    case errorTypes.NO_OF_FIND: {
      status = 406;
      message = "无法根据请求的内容进行进行响应~";
      break;
    }
    default: {
      status = 403;
      message = "未知错误...";
      break;
    }
  }
  ctx.body = {
    code: 0,
    statusCode: status,
    errorMessage: message,
  };
};
