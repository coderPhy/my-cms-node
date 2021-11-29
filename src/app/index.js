// dotenv bodyparser koa koa-router crypto
const Koa = require("koa");
const bodyparser = require("koa-bodyparser");
const errorHandle = require("./error.handle");

const app = new Koa();

// 处理跨域
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  await next();
});

const useRouter = require("../router");
app.useRouter = useRouter;
app.use(bodyparser());
app.useRouter();

app.on("error", errorHandle);

module.exports = app;
