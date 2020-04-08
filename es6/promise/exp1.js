const p1 = Promise.resolve("123");
// reject
const p2 = Promise.reject("456");
const p3 = Promise.resolve("789");
const p = Promise.allSettled([p1, p2, p3]);
p.then((arr) => console.log(arr));
// [
//   { status: 'fulfilled', value: '123' },
//   { status: 'rejected', reason: '456' },
//   { status: 'fulfilled', value: '789' }
// ]