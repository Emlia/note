// 依次执行

// 异步函数a
var a = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('a')
    }, 1000)
  })
}

// 异步函数b
var b = function (data) {
  return new Promise(function (resolve, reject) {
    resolve(data + '-b')
  })
}

// 异步函数c
var c = function (data) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(data + '-c')
    }, 500)
  })
}

// 异步函数d
var d = function (data) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(data + '-d')
    }, 500)
  })
}

// 1
a()
  .then(b)
  .then(c)
  .then(data => {
    console.log('1', data)
  })
// 2
function queue(arr) {
  let temp = Promise.resolve()
  arr.forEach(pom => {
    temp = temp.then(pom)
  });
  return temp
}

queue([a, b, c]).then(data => {
  console.log('2', data)
})

// 3
// async 函数返回值是 Promise 对象
// await命令就是内部then命令的语法糖
// 当 async 函数中只要一个 await 出现 reject 状态，则后面的 await 都不会被执行
// await可以直接获取到后面Promise成功状态传递的参数，但是却捕捉不到失败状态
// 最好把await命令放在try…catch代码块中
async function async_queue(arr) {
  let res = null
  for (let pom of arr) {
    try {
      res = await pom(res)
      console.log('----------', res)
    } catch (error) {
      console.log('----------', 'err')
    }
  }
  console.log('emm-', typeof res)
  return res
}

async_queue([a, b, c]).then(data => {
  console.log('3', data)
})

// error
// async_queue([a, d, b, c]).then(data => {
//   console.log('3', data)
// }).catch(err => {
//   console.log('3-err-', err)
// })
