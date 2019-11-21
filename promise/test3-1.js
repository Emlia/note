
const Pom = require('./exp3-1')// 引入模块

let p1 = new Pom(function (resolve, reject) {
  resolve('test')
})
p1.then(function (data) {
  console.log('成功', data)
}, function (err) {
  console.log('失败', err)
})
// 成功 test

let p2 = new Pom(function (resolve, reject) {
  reject('test')
})
p2.then(function (data) {
  console.log('成功', data)
}, function (err) {
  console.log('失败', err)
})
// 失败 test

let p3 = new Pom(function (resolve, reject) {
  setTimeout(function () {
    resolve(100)
  }, 1000)
})
p3.then(function (data) {
  console.log('成功', data)
}, function (err) {
  console.log('失败', err)
})
// 不会输出任何代码

// 原因是我们在then函数中只对成功态和失败态进行了判断，而实例被new时
// ，执行器中的代码会立即执行，但setTimeout中的代码将稍后执行，也就是说，
// then方法执行时，Promise的状态没有被改变依然是pending态，
// 所以我们要对pending态也做判断，而由于代码可能是异步的，
// 那么我们就要想办法把回调函数进行缓存，并且，then方法是可以多次使用的，
// 所以要能存多个回调，那么这里我们用一个数组。

