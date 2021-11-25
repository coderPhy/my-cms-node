const app = require("./app");
const config = require("./app/config");

app.listen(config.APP_PORT, () => {
  console.log(`服务启动在${APP_HOST}:${config.APP_PORT}端口`);
});
