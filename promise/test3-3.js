// 链式调用
// 不是 return this ,而是返回一个新的 promise
// 因为 promise 的状态是不可逆的,如果返回的是this，那么p2跟p1相同，固状态也相同，