// dotenv bodyparser koa koa-router crypto
const Koa = require("koa");
const cors = require("koa2-cors");
const bodyparser = require("koa-bodyparser");
const errorHandle = require("./error.handle");

const app = new Koa();

app.use(
  cors({
    origin: (ctx) => {
      return "*";
    },
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "post", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    AccessControlAllowHeaders: "*",
  })
);

const useRouter = require("../router");
app.useRouter = useRouter;
app.use(bodyparser());
app.useRouter();

app.on("error", errorHandle);

module.exports = app;
