// 使用 promise
add(1, 2)
  .then((data) => add(data, 3))
  .then((data) => add(data, 4))
  .then((data) => add(data, 5))
  .then(console.log);

function add(a, b) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b);
    }, 300);
  });
}
// 15
