const Router = require("koa-router");
const { login } = require("../controller/login.controller");
const { verifyLogin } = require("../middleware/auth.middleware");

const userRouter = new Router({ prefix: "/login" });

userRouter.post("/", verifyLogin, login);

module.exports = userRouter;
