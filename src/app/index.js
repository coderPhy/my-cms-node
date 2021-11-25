// dotenv bodyparser koa koa-router crypto
const Koa = require("koa");
const bodyparser = require("koa-bodyparser");
const errorHandle = require("./error.handle");

const app = new Koa();

const useRouter = require("../router");
app.useRouter = useRouter;
app.use(bodyparser());
app.useRouter();

app.on("error", errorHandle);

module.exports = app;
