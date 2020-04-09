# [Promises/A+](https://promisesaplus.com/#notes)

- 新建一个`promise`

  ```js
  // 成功的被then捕获
  new Promise((resolve, reject) => {
    console.log(1);
    resolve(3);
    console.log(2);
  }).then((data) => console.log(data));
  // 1 2 3
  ```

  ```js
  // 失败的被catch捕获
  new Promise((resolve, reject) => {
    console.log(1);
    reject(3);
    console.log(2);
  })
    .then((data) => console.log(data))
    .catch((err) => {
      console.log("err-" + err);
    });
  // 1 2 err-3
  ```

- `Promise` 对象有以下两个特点

  - 对象的状态不受外界影响。`Promise` 对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和 `rejected`（已失败）
  - 一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise` 对象的状态改变，只有两种可能：从 `pending` 变为 `fulfilled` 和从 `pending` 变为 `rejected`。只要这两种情况发生，状态就凝固了，不会再变了

- `Promise`也有一些缺点

  - 首先，无法取消 `Promise`，一旦新建它就会立即执行，无法中途取消
  - 其次，如果不设置回调函数，`Promise` 内部抛出的错误，不会反应到外部
  - 当处于 `pending` 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）

- 一旦状态改变成`resolve`或`reject`,则之后不会再改变

  ```js
  new Promise((resolve, reject) => {
    console.log(1);
    resolve(2);
    console.log(3);
    // 状态改变之后，promise 的状态就凝固了
    reject(4);
    console.log(5);
    resolve(6);
    console.log(7);
  })
    .then((data) => console.log(data))
    .catch((err) => {
      console.log("err-" + err);
    });
  // 1 3 5 7 2
  ```

  ```js
  const p = new Promise((resolve, reject) => {
    const date = new Date().getTime();
    resolve(date);
  });
  // then 可以多次调用，但是 promise 内部状态一经改变，不会改变
  p.then((data) => {
    const date = new Date().getTime();
    console.log(data, date);
  });
  // 两次获得的data是一致的，调用的时间是不同的
  const p2 = p.then((data) => {
    const date = new Date().getTime();
    console.log(data, date);
  });
  p2.then((data) => {
    console.log(data);
    console.log(p2 === p); // 每次产生的是一个新的promise
  });
  // 1586438193893 1586438193893
  // 1586438193893 1586438193900
  // undefined
  // false
  ```

- `Promise.resolve` 直接发送一个成功的值

  ```js
  Promise.resolve(1).then((data) => console.log(data));
  // 1
  ```

  ```js
  // Promise.resolve 相当于以下代码
  function resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }
  ```

- `Promise.reject` 直接发送一个失败的值

  ```js
  Promise.reject(1).catch((data) => console.log(data));
  // 1
  ```

- `then`的第一个参数接受`resolve`的`callback`,第二个参数，接受`reject`的`callback`

  ```js
  Promise.reject(1).then(
    (data) => console.log(data),
    (err) => {
      console.log("error:", err);
    }
  );
  // error: 1
  // 等价于
  Promise.reject(1)
    .then((data) => console.log(data))
    .catch((err) => {
      console.log("error:", err);
    });
  // error: 1
  ```

- `.catch`就是`.then`的变形,相当于产生了一个新的 `Promise` 对象，调用她的 `then` 方法

  ```js
  // .catch 相当于 以下代码
  Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
  };
  ```

  ```js
  Promise.resolve("abc")
    // .then(null,data=>console.log('1 : ',data))
    // 发生穿透
    .catch((data) => console.log("1 : ", data))
    .then((data) => console.log("2 : ", data));
  // 2 : abc
  ```

- `then`的第二个参数不能捕获，第一个参数中出现的错误,但是该 `then` 之后的 `catch` 可以捕获

  ```js
  Promise.resolve("abc")
    .then(
      (data) => {
        throw Error("this is an error");
      },
      (error) => {
        console.log("error 1 : ", error.message);
      }
    )
    .catch((error) => console.log("error 2 : ", error.message));
  // error 2 :  this is an error
  ```

- 将 `setTimeout` 包装成 `Promise`

  ```js
  new Promise((resolve, reject) => {
    console.log("my name is ");
    setTimeout(() => {
      resolve("zoe");
    }, 1000);
  }).then((data) => console.log(data));
  console.log("waiting 1000 ms ...");
  // my name is
  // waiting 1000 ms ...
  // zoe
  ```

- 如果 `.then`, `.catch` 接受一个函数，`.then()`, `.catch()`的结果必须是一个新的 `Promise` 对象

  1. 如果返回的是一个 `Promise` 实例,则直接返回该对象，并采用其状态
  2. 如果返回的是一个 `thenable`的`object`或`function`,认为它是一个`Promise`对象
  3. 如果返回的是 `string`,`bool`,`number`,`undefined`,`null`,一般的`object`,则会将返回值重新 `resolve` 成一个新的 `Promise` 对象,没写 `return` 相当于 `return undefined`
  4. 如果期间出错，则会将出错信息`reject` 成一个 新的 `Promise` 对象

```js
// 返回 promise 对象
Promise.resolve("123")
  .then(() => {
    return new Promise((resolve, reject) => {
      resolve("789");
    });
  })
  .then(console.log);
// 789

// 直接返回值
Promise.resolve("abc")
  .then((data) => "def")
  .then((data) => console.log(data));
// def

// 返回值是 thenable 的 function 或 object,就认为他是一个 promise 对象
Promise.resolve("123")
  .then(() => {
    const temp = () => {};
    temp.then = (resolve, reject) => {
      resolve("456");
    };
    return temp;
  })
  .then(console.log);
// 456
```

- `.then` 或者 `.catch` 的参数期望是函数，传入非函数则会发生值穿透

  - 如果传入参数不是函数，相当于 传入一个函数 `(data)=>data`

  ```js
  Promise.resolve("abc")
    .then("123")
    .then({})
    .then(null)
    .then((data) => console.log(data));
  // abc
  ```

- `finally()`方法用于指定不管 `Promise` 对象最后状态如何，都会执行的操作。该方法是 `ES2018` 引入标准的

  - `finally` 方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 `Promise` 状态到底是 `resolve` 还是 `rejected`。这表明，`finally` 方法里面的操作，应该是与状态无关的，不依赖于 `Promise` 的执行结果

  ```js
  Promise.resolve("abc")
    .then((data) => console.log(data))
    .finally(() => {
      console.log("end...");
    });
  // abc
  // end...
  ```

- `Promise.all()`方法用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例

  - 如果所有请求都成功的话，`p`的状态会变成`resolve`,此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数

  ```js
  const p1 = Promise.resolve("123");
  const p2 = Promise.resolve("456");
  const p3 = Promise.resolve("789");
  const p = Promise.all([p1, p2, p3]);
  p.then((arr) => console.log(arr));
  // [ '123', '456', '789' ]
  ```

  - 其中只要有一个请求失败了,`p`的状态就会变成`reject`,此时第一个被`reject`的实例的返回值，会传递给 p 的回调函数。

  ```js
  const p1 = Promise.resolve("123");
  // reject
  const p2 = Promise.reject("456");
  const p3 = Promise.resolve("789");
  const p = Promise.all([p1, p2, p3]);
  p.catch((arr) => console.log(arr));
  // 456
  ```

  - 即使失败了，也想得到所有的返回值

  ```js
  const p1 = Promise.resolve("123");
  const p2 = Promise.reject(Error("456 is error"));
  const p3 = Promise.resolve("789");
  const p = Promise.all([
    wrapperPromise(p1),
    wrapperPromise(p2),
    wrapperPromise(p3),
  ]);
  p.then((arr) => console.log(arr));
  // 对每一个 promise 处理一下 catch
  function wrapperPromise(pom) {
    return pom.catch((err) => err.message);
  }
  // [ '123', '456 is error', '789' ]
  ```

- `Promise.race()`,接受一个 `Promise` 实例数组,

  - 只要 `p1`、`p2`、`p3` 之中有一个实例率先改变状态，`p` 的状态就跟着改变。那个率先改变的 `Promise` 实例的返回值，就传递给 `p` 的回调函数。

  ```js
  const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("123");
    }, 1000);
  });
  const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("456");
    }, 200);
  });
  const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("789");
    }, 500);
  });
  const p = Promise.race([p1, p2, p3]);
  p.then((data) => console.log(data));
  // 456
  ```

- `Promise.allSettled()`

  - 该方法返回的新的 `Promise` 实例，一旦结束，状态总是 `fulfilled`，不会变成 `rejected`。

  ```js
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
  ```

- 异步 1+2+3+4+5

  ```js
  // callback 形式， 回调地狱
  add(1, 2, (result) => {
    add(result, 3, (result) => {
      add(result, 4, (result) => {
        add(result, 5, (result) => {
          console.log(result);
        });
      });
    });
  });

  function add(a, b, callback) {
    setTimeout(() => {
      const result = a + b;
      callback(result);
    }, 300);
  }

  // 15
  ```

  ```js
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
  ```

  ```js
  // 使用 async await
  (async () => {
    const one = await add(1, 2);
    const two = await add(one, 3);
    const three = await add(two, 4);
    const result = await add(three, 5);
    console.log(result);
  })();

  function add(a, b) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(a + b);
      }, 300);
    });
  }
  // 15
  ```
