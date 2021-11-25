const Router = require("koa-router");
const roleRouter = new Router({ prefix: "/role" });

const {
  create,
  remove,
  edit,
  get,
  list,
  getMenuByRoleId,
} = require("../controller/role.controller");
const { verifyAuth } = require("../middleware/auth.middleware");

roleRouter.post("/", verifyAuth, create);
roleRouter.delete("/:roleId", verifyAuth, remove);
roleRouter.patch("/:roleId", verifyAuth, edit);
roleRouter.get("/:roleId", verifyAuth, get);
roleRouter.post("/list", verifyAuth, list);

// 查询角色菜单树
roleRouter.get("/:roleId/menu", verifyAuth, getMenuByRoleId);
// 查询角色菜单ids
// roleRouter.get("/:roleId/menulds", verifyAuth);
// 给角色分配权限
// roleRouter.post("/assign", verifyAuth, setRoleMenu);

module.exports = roleRouter;
