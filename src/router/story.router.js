const Router = require("koa-router");
const { verifyAuth } = require("../middleware/auth.middleware");
const { create, list } = require("../controller/story.controller");
const storyRouter = new Router({ prefix: "/story" });

storyRouter.post("/", verifyAuth, create);
storyRouter.post("/list", verifyAuth, list);

module.exports = storyRouter;
