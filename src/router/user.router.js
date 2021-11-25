const Router = require("koa-router");

const { verifyAuth } = require("../middleware/auth.middleware");
const { verifyUser, handlePassword } = require("../middleware/user.middleware");
const {
  create,
  remove,
  edit,
  get,
  list,
} = require("../controller/user.controller");

const userRouter = new Router({ prefix: "/users" });

// 创建用户
userRouter.post("/", verifyUser, handlePassword, create);
userRouter.delete("/:userId", verifyAuth, remove);
userRouter.patch("/:userId", verifyAuth, edit);
userRouter.get("/:userId", verifyAuth, get);
userRouter.post("/list", verifyAuth, list);

module.exports = userRouter;
