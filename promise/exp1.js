// Promise.all 容错
function emlia(callback) {
  return new Promise(callback)
}

function wrapper(promise) {
  return promise.then(res => res).catch(err => err)
}

const e1 = emlia((resolve, reject) => {
  setTimeout(() => {
    console.log('111')
    resolve('2222')
  }, 1000);
})

const e2 = emlia((resolve, reject) => {
  setTimeout(() => {
    console.log('333')
    resolve('444')
  }, 100);
})

const e3 = emlia((resolve, reject) => {
  setTimeout(() => {
    console.log('555')
    reject('err-666')
  }, 500);
})

Promise.all([e1, e2, wrapper(e3)]).then(res => {
  console.log('res--suc-->', res)
}).catch(err => {
  console.log('res--err-->', err)
})

