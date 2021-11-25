const fs = require("fs");
const connection = require("../app/database");

const readFile = (fileUrl) => {
  const jsonFile = fs.readFileSync(fileUrl, "utf-8");
  const jsonData = JSON.parse(jsonFile);
  jsonData.forEach(async (item) => {
    // const {
    //   id,
    //   name,
    //   oldPrice,
    //   newPrice,
    //   desc,
    //   status,
    //   imgUrl,
    //   inventoryCount,
    //   saleCount,
    //   favorCount,
    //   address,
    //   categoryId,
    // } = item;
    const { address, count } = item;
    console.log(address, count);
    const statement = `INSERT INTO address (address, count) VALUES('${address}',${count})`;
    const result = await connection.execute(statement);
    // "INSERT INTO product (name, oldPrice, newPrice, `desc`, `status`, imgUrl,inventoryCount, saleCount, favorCount, address, categoryId) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    // const result = await connection.execute(statement, [
    //   name,
    //   oldPrice,
    //   newPrice,
    //   desc,
    //   status,
    //   imgUrl,
    //   inventoryCount,
    //   saleCount,
    //   favorCount,
    //   address,
    //   categoryId,
    // ]);

    // if (result) {
    //   console.log("插入数据库成功~");
    // } else {
    //   console.log("插入数据库失败~");
    // }
  });
};

module.exports = {
  readFile,
};
