const Koa = require("koa");
const Router = require("koa-router");
const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "home page";
});

router.get("/getNameById", async (ctx) => {
  const { id = 0, callback = "show" } = ctx.query;
  const nameMap = [
    { id: "233", name: "emlia" },
    { id: "998", name: "zoe" },
  ];
  const filterItem = nameMap.filter((item) => item.id === id)[0];
  const name = (filterItem && filterItem.name) || "nameless";
  // 延迟 1000ms 返回数据
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`${callback}('${name}')`);
    }, 1000);
  });
  ctx.body = result;
});

app.use(router.routes());
app.listen(3000);
