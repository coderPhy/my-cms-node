const handleArray = (arrs) => {
  for (let arr of arrs) {
    if (!arr.children) break;
    if (!arr.children.length) {
      arr.children = null;
    } else {
      const newArr = handleArray(arr.children);
      arr.children = newArr;
    }
  }
  return arrs;
};

module.exports = {
  handleArray,
};
