const Router = require("koa-router");
const { verifyAuth } = require("../middleware/auth.middleware");
const {
  list,
  getCategoryCount,
  getCategorySale,
  getCategoryFavor,
  getAddressSale,
} = require("../controller/goods.controller");

const goodsRouter = new Router({ prefix: "/goods" });

goodsRouter.post("/list", verifyAuth, list);
// 图表数据
goodsRouter.get("/category/count", verifyAuth, getCategoryCount);
goodsRouter.get("/category/sale", verifyAuth, getCategorySale);
goodsRouter.get("/category/favor", verifyAuth, getCategoryFavor);
goodsRouter.get("/address/sale", verifyAuth, getAddressSale);

module.exports = goodsRouter;
