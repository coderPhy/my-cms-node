const userService = require("../service/user.service");
const errorTypes = require("../constants/error-types");

class UserController {
  async create(ctx, next) {
    try {
      const {
        name,
        realname,
        password,
        cellphone,
        avatar_url,
        departmentId,
        roleId,
      } = ctx.request.body;
      const result = await userService.create(
        name,
        realname,
        password,
        cellphone,
        avatar_url,
        departmentId,
        roleId
      );
      if (!result) {
        const error = new Error(errorTypes.USER_OR_REALNAME_IS_EXiSTS);
        return ctx.app.emit("error", error, ctx);
      }
      ctx.body = {
        code: 1,
        stateCode: 200,
        errorMessge: null,
        data: "创建用户成功!",
      };
    } catch (error) {
      console.log(error);
    }
  }
  async remove(ctx, next) {
    const { userId } = ctx.request.params;
    if (userId <= 57 || userId === 79) {
      ctx.body = {
        code: 1,
        data: "id小于57或者id等于79的用户不可以删除",
      };
      return;
    }
    const result = await userService.remove(userId);
    if (!result.affectedRows) {
      const error = new Error(errorTypes.NO_OF_FIND);
      return ctx.app.emit("error", error, ctx);
    }
    ctx.body = {
      code: 1,
      stateCode: 200,
      data: "删除用户成功!",
    };
  }
  async edit(ctx, next) {
    try {
      const user = ctx.request.body;
      const { userId } = ctx.request.params;
      if (userId <= 57 || userId === 79) {
        ctx.body = {
          code: 1,
          data: "id小于57或者id等于79的用户不可以修改",
        };
        return;
      }
      const isExists = await userService.isExistsByRealName(
        userId,
        user.realname
      );
      if (isExists) {
        const error = new Error(errorTypes.REALNAME_IS_EXiSTS);
        return ctx.app.emit("error", error, ctx);
      }
      const result = await userService.edit(user, userId);
      if (result) {
        ctx.body = {
          code: 1,
          data: "修改用户成功!",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async get(ctx, next) {
    const { userId } = ctx.request.params;
    const data = await userService.get(userId);
    if (!data) {
      const error = new Error(errorTypes.NO_OF_FIND);
      return ctx.app.emit("error", error, ctx);
    }
    ctx.body = {
      code: 1,
      statement: 200,
      data,
    };
  }
  async list(ctx, next) {
    try {
      const { offset, size, cellphone, createAt, enable, id, name, realname } =
        ctx.request.body;
      const queryArr = [
        { key: "id", value: id },
        { key: "enable", value: enable },
        { key: "name", value: name },
        { key: "realname", value: realname },
        { key: "cellphone", value: cellphone },
        { key: "createAt", value: createAt },
      ];
      const newQueryArr = [];
      for (let i = 0; i < queryArr.length; i++) {
        if (i <= 1) {
          newQueryArr.push({
            type: "number",
            text: queryArr[i].key,
            value: queryArr[i].value,
          });
        } else if (queryArr[i].key === "createAt") {
          newQueryArr.push({
            type: "time",
            text: queryArr[i].key,
            value: queryArr[i].value,
          });
        } else {
          newQueryArr.push({
            type: "string",
            text: queryArr[i].key,
            value: queryArr[i].value,
          });
        }
      }
      if (offset === undefined || size === 0 || size === undefined) {
        const list = await userService.list(0, 1000);
        const totalCount = list.length;
        ctx.body = {
          code: 0,
          stateCode: 200,
          data: {
            list,
            totalCount,
          },
        };
      } else if (cellphone || createAt || enable || id || name || realname) {
        const list = await userService.list(offset, size, newQueryArr);
        const totalCount = list.length;
        ctx.body = {
          code: 0,
          stateCode: 200,
          data: {
            list,
            totalCount,
          },
        };
      } else if (size) {
        // 不带条件
        let list = await userService.list(offset, size);
        const totalCount = await userService.totalCount();
        ctx.body = {
          code: 0,
          stateCode: 200,
          data: {
            list,
            totalCount,
          },
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserController();
