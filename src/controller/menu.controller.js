const menuService = require("../service/menu.service");
const errorTypes = require("../constants/error-types");
const { handleArray } = require("../utils/handle-array");

class MenuController {
  async get(ctx, next) {
    const { menuId } = ctx.request.params;
    const data = await menuService.get(menuId);
    if (!data) {
      const error = new Error(errorTypes.NO_OF_FIND);
      return ctx.app.emit("error", error, ctx);
    }
    ctx.body = {
      code: 1,
      data,
    };
  }
  async list(ctx, next) {
    try {
      // coderwhy传的offset size都没做分页
      let fullMenuList = [];
      const menuList = await menuService.list();
      const { totalCount } = await menuService.totalCount();

      menuList.forEach((menu) => {
        if (menu.type === 1) {
          fullMenuList.push({ ...menu, children: [] });
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
                icon: menu.icon,
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
                menu3.children.push({ ...menu });
              }
            });
          });
        }
      });
      fullMenuList = handleArray(fullMenuList);
      ctx.body = {
        code: 0,
        data: {
          list: fullMenuList,
          totalCount,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new MenuController();
