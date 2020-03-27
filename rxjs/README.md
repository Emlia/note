### this is rxjs note

- [rxjs](/code/rxjs)

  ```
  <body>
    <p>Button only responds once within 2s</p>
    <p id="text">0</p>
    <button>btn</button>
    <script>
      const { fromEvent, pipe } = rxjs
      const { scan, throttleTime } = rxjs.operators
      const btn = document.querySelector('button')
      const text = document.querySelector('#text')
      fromEvent(btn, 'click')
        .pipe(throttleTime(2000), scan(count => count + 1, 0))
        .subscribe((count) => text.innerHTML = count)
    </script>
  </body>
  ```

- **创建数据流**
- [Observale](/code/rxjs/create/observable.html)

  - 使用`Observable` 的构造函数创建
  - `Observable` 对象使用`subscribe`订阅,`next` 推送数据后触发,`error` 出错时触发,`complete` 完成时触发
  - `unsubscribe` 退订，`Observer` 退订后，不管 `source$` 是否会继续推送数据。`unsubscribe`是断开了`source$`对象和`Observer`的连接
  - `onSubscribe` 返回一个函数,`observer` 结束时触发，用于回收`onSubscribe`中的一些资源,`error`,`complete`,`unsubscribe`都会触发该函数
  - `onSubscribe` 定义了推送的数据和它的时间流程
  - `subscribe` 订阅时收到的数据是推送过来的数据,订阅的可以是`Observer`,也可以是`functions`
  - `Observable` 对象就像一台只会 产生数据的机器，`Observer` 则是一台只会处理数据的机器

  ```js
  const { Observable } = rxjs;
  const onSubscribe = observer => {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    // observer.error("something wrong");
    observer.next(4);
    observer.complete();
    return () => {
      console.log("observer 结束");
    };
  };
  const source$ = new Observable(onSubscribe);
  // Subscribe with functions
  source$.subscribe(
    x => console.log("next-" + x),
    err => console.log("error-" + err),
    () => console.log("complete")
  );
  ```

  ```js
  // Subscribe with an Observer
  const sumObserver = {
    sum: 0,
    next(value) {
      console.log("Adding: " + value);
      this.sum = this.sum + value;
    },
    error() {},
    complete() {
      console.log("Sum equals: " + this.sum);
    }
  };
  source$.subscribe(sumObserver);
  ```

- [Observale.create](/code/rxjs/create/observable-create.html)

  ```js
  // 当我们使用 create() 方法创建 Observable 时，Observable 必须定义如何清理执行的资源。
  // 你可以通过在 function subscribe() 中返回一个自定义的 unsubscribe 函数。
  const { Observable } = rxjs;
  const observable = Observable.create(observer => {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    setTimeout(() => {
      observer.next(4);
      // observer.complete();
    }, 1000);
    // 追踪 interval 资源
    var intervalID = setInterval(() => {
      observer.next("hi");
    }, 200);
    // create 中需要自己定义 unsubscribe
    return function unsubscribe() {
      clearInterval(intervalID);
      console.log("observer cancel subscribe");
    };
  });
  console.log("just before subscribe");
  const subscription = observable.subscribe({
    next: x => console.log("get value " + x),
    error: err => console.error("something wrong occurred: " + err),
    complete: () => console.log("done")
  });
  console.log("just after subscribe");
  // 3s 后取消订阅
  setTimeout(() => {
    subscription.unsubscribe();
  }, 3000);
  ```

- `of`创建指定数据集合的 Observable 对象

  - `of<T>(...args: (SchedulerLike | T)[]): Observable<T>`
  - `source$`被订阅时，吐出数据的过程是同步的，也就是 没有任何时间上的间隔
  - eg: `of(1, 2, 3)`

- `range` 产生这个范围内的数字序列。

  - `range(start: number = 0, count?: number, scheduler?: SchedulerLike): Observable<number>`
  - eg: `range(1,100)`

- `generate` 类似一个 for 循环，设定一个初始值，每次递增这个值，直到 满足某个条件的时候才中止循环

  - `generate<T, S>(initialStateOrOptions: S | GenerateOptions<T, S>, condition?: ConditionFunc<S>, iterate?: IterateFunc<S>, resultSelectorOrObservable?: SchedulerLike | ResultFunc<S, T>, scheduler?: SchedulerLike): Observable<T>`

  ```js
  const { generate } = rxjs;
  const source$ = generate(
    2, //初始值，相当于for循环中的i=2
    value => value < 10, //继续的条件，相当于for中的条件判断
    value => value + 2, //每次值的递增
    value => `${value} -> ${value * value}` // 产生的结果
  );
  source$.subscribe(x => console.log(`next-${x}`));
  ```

- `repeat` repeat 的功能是可以重复上游 Observable 中的数据若干次
  - `repeat<T>(count: number = -1): MonoTypeOperatorFunction<T>`
  - `repeat`只有在上游`Observable`对象完结之后才 会再次去`subscribe`这个对象，如果上游`Observable`对象永不完结，那`repeat` 也就没有机会去`unsubscribe`。
  ```js
  const source = of("Repeat message");
  const example = source.pipe(repeat(3));
  example.subscribe(x => console.log(x));
  // Results
  // Repeat message
  // Repeat message
  // Repeat message
  ```
- `empty`,`empty`就是产生一个直接完结的`Observable`对象，没有参数，不产生任何数据，直接完结

  ```js
  // Emit the number 7, then complete
  import { empty } from "rxjs";
  import { startWith } from "rxjs/operators";

  const result = empty().pipe(startWith(7));
  result.subscribe(x => console.log(x));
  ```

- `throwError`,仅仅发送一个`error`,什么都不做

  ```js
  import { throwError, concat, of } from "rxjs";

  const result = concat(of(7), throwError(new Error("oops!")));
  result.subscribe(
    x => console.log(x),
    e => console.error(e)
  );
  // Logs:
  // 7
  // Error: oops!
  ```

- `NEVER`,不推送数据，不结束，也不发送错误

  ```js
  // Emit the number 7, then never emit anything else (not even complete)
  import { NEVER } from "rxjs";
  import { startWith } from "rxjs/operators";

  function info() {
    console.log("Will not be called");
  }
  const result = NEVER.pipe(startWith(7));
  result.subscribe(x => console.log(x), info, info);
  ```

- `interval`,类似`setInterval`,`interval`接受一个数值类型的参数，代表产生数据的间隔毫秒数
  - `interval(period: number = 0, scheduler: SchedulerLike = async): Observable<number>`
  - eg: `interval(1000);`,从 0 开始，每 1000ms 吐出一个数字, 0 , 1 , 2 , 3 ...,在被订阅之后， 在 1 秒钟的时刻吐出数据 0
- `timer`,类似`setTimeout`,
  ```js
  // 2s 之后，吐出一个数据 0
  const numbers = timer(2000);
  numbers.subscribe(x => console.log(x));
  // 3s 之后，每1s 吐出有个数据, 0,1,2,3,4
  const numbers = timer(3000, 1000);
  numbers.subscribe(x => console.log(x));
  ```
- `from`,可把一切转化为`Observable`
  ```js
  const { from, of, asyncScheduler } = rxjs;
  // array
  from([1, 2, 3]).subscribe(x => console.log(`arr[1,2,3]-${x}`));
  // string
  from("abc").subscribe(x => console.log(`abc-${x}`));
  // of
  from(of(1, 2, 3)).subscribe(x => console.log(`of(abc)-${x}`));
  // Promise
  from(Promise.resolve("haha")).subscribe(x => console.log(`promise-${x}`));
  // 异步
  console.log("start");
  from([1, 2, 3], asyncScheduler).subscribe(x =>
    console.log(`async [1,2,3]-${x}`)
  );
  console.log("end");
  ```
