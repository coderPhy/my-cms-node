const Router = require("koa-router");
const {
  create,
  remove,
  edit,
  list,
} = require("../controller/department.controller");
const { verifyAuth } = require("../middleware/auth.middleware");

const departmentRouter = new Router({ prefix: "/department" });

departmentRouter.post("/", verifyAuth, create);
departmentRouter.delete("/:departmentId", verifyAuth, remove);
departmentRouter.patch("/:departmentId", verifyAuth, edit);
departmentRouter.post("/list", verifyAuth, list);

module.exports = departmentRouter;
