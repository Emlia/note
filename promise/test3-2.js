
const Pom = require('./exp3-2')// 引入模块

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
// 异步 test

new Pom(function (resolve, reject) {
  throw new Error('错误')
}).then(function () {

}, function (err) {
  console.log('错误:err')
})
// 错误: Error: 错误
