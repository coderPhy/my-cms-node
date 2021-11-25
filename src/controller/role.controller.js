const roleService = require("../service/role.service");
const menuService = require("../service/menu.service");
const errorTypes = require("../constants/error-types");
const { handleArray } = require("../utils/handle-array");

class RoleController {
  async create(ctx, next) {
    try {
      const { name, intro, menuList } = ctx.request.body;
      const result = await roleService.create(name, intro, menuList);
      if (!result) {
        const error = new Error(errorTypes.NO_OF_FIND);
        return ctx.app.emit("error", error, ctx);
      }
      ctx.body = {
        code: 1,
        stateCode: 200,
        data: "创建角色成功~",
      };
    } catch (error) {
      const error2 = new Error(errorTypes.DATABASE_UNUSUAL);
      ctx.app.emit("error", error2, ctx);
    }
  }
  async remove(ctx, next) {
    try {
      const { roleId } = ctx.request.params;
      if (roleId <= 13) {
        return (ctx.body = {
          code: 1,
          data: "id小于等于13的角色不可以删除~",
        });
      }
      const result = await roleService.remove(roleId);
      if (!result.affectedRows)
        return ctx.app.emit("error", new Error(errorTypes.NO_OF_FIND), ctx);
      ctx.body = {
        code: 0,
        data: "删除角色成功~",
      };
    } catch (error) {
      console.log(error);
    }
  }
  async edit(ctx, next) {
    try {
      let { roleId } = ctx.request.params;
      let { name, intro, menuList } = ctx.request.body;
      name = name || "";
      intro = intro || "";
      if (!menuList) menuList = [];

      const result = await roleService.edit(roleId, name, intro, menuList);
      if (!result)
        return ctx.app.emit(
          "error",
          new Error(errorTypes.DATABASE_UNUSUAL),
          ctx
        );
      ctx.body = {
        code: 0,
        data: "修改角色成功!",
      };
    } catch (error) {
      console.log(error);
    }
  }
  async get(ctx, next) {
    const { roleId } = ctx.request.params;
    const data = await roleService.get(roleId);
    if (!data) {
      const error = new Error(errorTypes.NO_OF_FIND);
      return ctx.app.emit("error", error, ctx);
    }
    ctx.body = {
      code: 1,
      stateCode: 200,
      data,
    };
  }
  async list(ctx, next) {
    try {
      const { offset, size, intro, name, createAt } = ctx.request.body;
      let list = await roleService.list(offset, size, intro, name, createAt);
      const totalCount = list ? list.length : 0;
      for (let i = 0; i < list.length; i++) {
        let fullMenuList = [];
        const roleId = list[i].id;
        const menuList = await roleService.getMenuByRoleId(roleId);

        menuList.forEach((menu) => {
          if (menu.type === 1) {
            fullMenuList.push({
              id: menu.id,
              name: menu.name,
              type: menu.type,
              url: menu.url,
              icon: menu.icon,
              children: [],
            });
          }
        });
        menuList.forEach((menu) => {
          if (menu.type === 2) {
            fullMenuList.forEach((menu2) => {
              if (menu.parentId === menu2.id) {
                menu2.children.push({
                  id: menu.id,
                  url: menu.url,
                  name: menu.name,
                  type: menu.type,
                  children: [],
                });
                // menu2.children.push({ ...menu, children: [] });
              }
            });
          }
        });
        menuList.forEach((menu) => {
          if (menu.type === 3) {
            fullMenuList.forEach((menu2) => {
              menu2.children.forEach((menu3) => {
                if (menu3.id === menu.parentId) {
                  menu3.children.push({
                    id: menu.id,
                    url: menu.url,
                    name: menu.name,
                    type: menu.type,
                    parentId: menu.parentId,
                    permission: menu.permission,
                  });
                }
              });
            });
          }
        });
        fullMenuList = handleArray(fullMenuList);
        list[i].menuList = fullMenuList;
      }

      ctx.body = {
        code: 1,
        stateCode: 200,
        data: {
          list,
          totalCount,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
  async getMenuByRoleId(ctx, next) {
    const { roleId } = ctx.request.params;
    let fullMenuList = [];
    const menuList = await roleService.getMenuByRoleId(roleId);
    menuList.forEach((menu) => {
      if (menu.type === 1) {
        const { id, icon, name, type, url } = menu;
        fullMenuList.push({ id, icon, name, type, url, children: [] });
      }
    });
    menuList.forEach((menu) => {
      if (menu.type === 2) {
        const { id, name, parentId, type, url } = menu;
        fullMenuList.forEach((menu2) => {
          if (menu.parentId === menu2.id) {
            menu2.children.push({
              id,
              name,
              parentId,
              type,
              url,
              children: [],
            });
          }
        });
      }
    });
    menuList.forEach((menu) => {
      if (menu.type === 3) {
        const { id, name, parentId, permission, type, url } = menu;
        fullMenuList.forEach((menu2) => {
          menu2.children.forEach((menu3) => {
            if (menu3.id === menu.parentId) {
              menu3.children.push({
                id,
                name,
                parentId,
                permission,
                type,
                url,
              });
            }
          });
        });
      }
    });
    fullMenuList = handleArray(fullMenuList);

    ctx.body = {
      code: 0,
      data: fullMenuList,
    };
  }
}

module.exports = new RoleController();
