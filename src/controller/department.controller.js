const departmentService = require("../service/department.service");
const errorTypes = require("../constants/error-types");

class DepartmentController {
  async create(ctx, next) {
    const { name, leader } = ctx.request.body;
    const data = await departmentService.create(name, leader);
    if (!data) {
      const error = new Error(errorTypes.NO_OF_FIND);
      return ctx.app.emit("error", error, ctx);
    }
    ctx.body = {
      code: 1,
      stateCode: 200,
      data: "创建部门成功",
    };
  }
  async edit(ctx, next) {
    try {
      const { departmentId } = ctx.request.params;
      const { leader, name } = ctx.request.body;
      if (departmentId <= 14) {
        ctx.body = {
          code: 1,
          data: "id小于等于14的部门不允许修改!",
        };
        return;
      }
      const result = await departmentService.edit(leader, name, departmentId);
      if (!result) {
        const error = new Error(errorTypes.NO_OF_FIND);
        return ctx.app.emit("error", error, ctx);
      }
      ctx.body = {
        code: 0,
        data: "修改部门成功!",
      };
    } catch (error) {
      console.log(error);
      return ctx.app.emit(new Error(errorTypes.NO_OF_FIND));
    }
  }
  async remove(ctx, next) {
    const { departmentId } = ctx.request.params;
    if (departmentId <= 14) {
      ctx.body = {
        code: 1,
        data: "id小于等于14的部门不允许删除!",
      };
      return;
    }
    const result = await departmentService.remove(departmentId);
    if (!result.affectedRows)
      return ctx.app.emit("error", new Error(errorTypes.NO_OF_FIND), ctx);
    ctx.body = {
      code: 0,
      data: "删除部门成功~",
    };
  }
  async list(ctx, next) {
    const { offset, size } = ctx.request.body;
    const list = await departmentService.list(offset, size);
    const { totalCount } = await departmentService.totalCount();
    if (!list || !totalCount) {
      const error = new Error(errorTypes.NO_OF_FIND);
      return ctx.app.emit("error", error, ctx);
    }
    ctx.body = {
      code: "1",
      data: {
        list,
        totalCount,
      },
    };
  }
}

module.exports = new DepartmentController();
