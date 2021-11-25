const goodsServive = require("../service/goods.servive");
const errorTypes = require("../constants/error-types");

class GoodsController {
  async list(ctx, next) {
    const { offset, size, name, address, status, createAt } = ctx.request.body;
    if (name || address || status || createAt) {
      const list = await goodsServive.list(offset, size, {
        name,
        address,
        status,
        createAt,
      });
      const totalCount = list.length;
      ctx.body = {
        code: 0,
        data: {
          list,
          totalCount,
        },
      };
    } else {
      // 不加筛选条件的查询
      const list = await goodsServive.list(offset, size);
      if (!list) {
        return ctx.app.emit("error", new Error(errorTypes.NO_OF_FIND), ctx);
      }
      const totalCount = await goodsServive.totalCount();
      // let totalCount = list.length ? list.length : 0;
      ctx.body = {
        code: 0,
        data: {
          list,
          totalCount,
        },
      };
    }
  }
  async getCategoryCount(ctx, next) {
    const data = await goodsServive.getCategoryCount();
    if (data && !data.length) {
      return ctx.app.emit("error", new Error(errorTypes.NO_OF_FIND), ctx);
    }
    ctx.body = {
      code: 0,
      data,
    };
  }
  async getCategorySale(ctx, next) {
    try {
      const data = await goodsServive.getCategorySale();
      if (data && !data.length) {
        return ctx.app.emit("error", new Error(errorTypes.NO_OF_FIND), ctx);
      }
      ctx.body = {
        code: "0",
        data,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async getCategoryFavor(ctx, next) {
    try {
      const data = await goodsServive.getCategoryFavor();
      ctx.body = {
        code: 0,
        data,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async getAddressSale(ctx, next) {
    const data = await goodsServive.getAddressSale();
    ctx.body = {
      code: 0,
      data,
    };
  }
}

module.exports = new GoodsController();
