// myPromise
function Promise(executor) { //executor是一个执行器（函数）
  let _this = this // 先缓存this以免后面指针混乱
  _this.status = 'pending' // 默认状态为等待态
  _this.value = undefined // 成功时要传递给成功回调的数据，默认undefined
  _this.reason = undefined // 失败时要传递给失败回调的原因，默认undefined
  _this.onResolvedCallbacks = []; // 存放then成功的回调
  _this.onRejectedCallbacks = []; // 存放then失败的回调
  function resolve(value) { // 内置一个resolve方法，接收成功状态数据
    // 上面说了，只有pending可以转为其他状态，所以这里要判断一下
    if (_this.status === 'pending') {
      _this.status = 'resolved' // 当调用resolve时要将状态改为成功态
      _this.value = value // 保存成功时传进来的数据
      _this.onResolvedCallbacks.forEach(function (fn) { // 当成功的函数被调用时，之前缓存的回调函数会被一一调用
        fn()
      })
    }

  }
  function reject(reason) { // 内置一个reject方法，失败状态时接收原因
    if (_this.status === 'pending') { // 和resolve同理
      _this.status = 'rejected' // 转为失败态
      _this.reason = reason // 保存失败原因
      _this.onRejectedCallbacks.forEach(function (fn) {// 当失败的函数被调用时，之前缓存的回调函数会被一一调用
        fn()
      })
    }
  }
  try {
    executor(resolve, reject)
  } catch (e) { // 如果捕获发生异常，直接调失败，并把参数穿进去
    reject(e)
  }

}
// then方法接收两个参数，分别是成功和失败的回调，这里我们命名为onFulfilled和onRjected
Promise.prototype.then = function (onFulfilled, onRjected) {
  let _this = this;   // 依然缓存this
  if (_this.status === 'resolved') {  // 判断当前Promise的状态
    onFulfilled(_this.value)  // 如果是成功态，当然是要执行用户传递的成功回调，并把数据传进去
  }
  if (_this.status === 'rejected') { // 同理
    onRjected(_this.reason)
  }
  if (_this.status === 'pending') {
    // 每一次then时，如果是等待态，就把回调函数push进数组中，什么时候改变状态什么时候再执行
    _this.onResolvedCallbacks.push(function () { // 这里用一个函数包起来，是为了后面加入新的逻辑进去
      onFulfilled(_this.value)
    })
    _this.onRejectedCallbacks.push(function () { // 同理
      onRjected(_this.reason)
    })
  }

}
module.exports = Promise  // 导出模块，否则别的文件没法使用


