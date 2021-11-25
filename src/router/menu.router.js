const Router = require("koa-router");
const { verifyAuth } = require("../middleware/auth.middleware");
const { get, list } = require("../controller/menu.controller");

const menuRouter = new Router({ prefix: "/menu" });

menuRouter.get("/:menuId", get);
menuRouter.post("/list", verifyAuth, list);

module.exports = menuRouter;
