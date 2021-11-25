const storyService = require("../service/story.service");
const errorTypes = require("../constants/error-types");

class StoryController {
  async create(ctx, next) {
    try {
      const { title, content } = ctx.request.body;
      const userId = ctx.user.id;
      if (!title || !content) {
        return ctx.app.emit("error", new Error(errorTypes.NO_OF_FIND), ctx);
      }
      const result = await storyService.create(userId, title, content);
      if (!result[0].affectedRows) {
        ctx.body = {
          code: 1,
          data: "发布故事失败!",
        };
      } else {
        ctx.body = {
          code: 0,
          data: "发布故事成功!",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async list(ctx, next) {
    try {
      const { offset, size } = ctx.request.body;
      const list = await storyService.list(offset, size);
      if (!list.length)
        return ctx.app.emit("error", new Error(errorTypes.NO_OF_FIND), ctx);
      let totalCount = list.length;
      ctx.body = {
        code: 0,
        data: {
          list,
          totalCount,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new StoryController();
