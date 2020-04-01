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
- `fromEvent`,将`dom`事件转成`Observable`
  ```js
  const { fromEvent, pipe } = rxjs;
  const { scan, throttleTime } = rxjs.operators;
  const btn = document.querySelector("button");
  const text = document.querySelector("#text");
  fromEvent(btn, "click")
    .pipe(
      throttleTime(2000),
      scan(count => count + 1, 0)
    )
    .subscribe(count => (text.innerHTML = count));
  ```
- `fromEventPattern`,`fromEventPattern`设计为这样，当 `Observable`对象被`subscribe`时第一个函数参数被调用，被`unsubscribe`时第二 个函数参数被调用

  ```js
  import { fromEventPattern } from "rxjs";

  function addClickHandler(handler) {
    document.addEventListener("click", handler);
  }

  function removeClickHandler(handler) {
    document.removeEventListener("click", handler);
  }

  const clicks = fromEventPattern(addClickHandler, removeClickHandler);
  clicks.subscribe(x => console.log(x));

  // Whenever you click anywhere in the browser, DOM MouseEvent
  // object will be logged.
  ```

- `ajax`
- `repeatWhen`

  - `repeatWhen(() => documentClick$)`
  - `repeatWhen`接受一个函数作为参数，这个函数在上游第一次产生异常 时被调用，然后这个函数应该返回一个`Observable`对象，这个对象就是一 个控制器，作用就是控制`repeatWhen`**何时重新订阅上游**，当控制器 `Observable`吐出一个数据的时候，`repeatWhen`就会做退订上游并重新订阅的 动作。

  ```js
  const { of, fromEvent, interval } = rxjs;
  const { repeatWhen, delay } = rxjs.operators;

  const source$ = of("Repeat message");
  const documentClick$ = fromEvent(document, "click");

  source$
    .pipe(repeatWhen(() => documentClick$))
    .subscribe(data => console.log(data));
  ```

- **合并数据流**

- `concat`，首尾相连

  - 当第一个 Observable 对象 complete 之后，concat 就会去 subscribe 第二 个 Observable 对象获取数据，把数据同样传给下游
  - 如果上游是一个永不终结的数据流，则下游永远无法被订阅
  - 依次类推，直到最后一个 Observable 完结之后，concat 产生的 Observable 也就完结了
  - !['concat'](https://rxjs.dev/assets/images/marble-diagrams/concat.png)

  ```js
  const { of, fromEvent, interval, concat, range } = rxjs;
  const { repeatWhen, delay, take } = rxjs.operators;

  const timer = interval(1000).pipe(take(4));
  const sequence = range(1, 10);
  const result = concat(timer, sequence);
  result.subscribe(
    x => console.log(x),
    err => console.log(err),
    () => console.log("done")
  );

  // results in:
  // 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3 -immediate-> 1 ... 10 ->done
  ```

- `merge`,先到先得快速通过

  - merge 会第一时间订阅所有的上游 Observable，然 后对上游的数据采取“先到先得”的策略，任何一个 Observable 只要有数据推 下来，就立刻转给下游 Observable 对象
  - merge 只有在所有的上游 Observable 都完结的时候，才会 完结自己产生的 Observable 对象
  - !['merge'](https://rxjs.dev/assets/images/marble-diagrams/merge.png)

  ```js
  import { merge, fromEvent, interval } from "rxjs";
  const clicks = fromEvent(document, "click");
  const timer = interval(1000);
  const clicksOrTimer = merge(clicks, timer);
  clicksOrTimer.subscribe(x => console.log(x));
  ```

- `zip`
  - 只要任何一个上游的 Observable 完结,zip 会等待数据合并完成后 complete
  ```js
  const age$ = of(27, 25, 29);
  const name$ = of("Foo", "Bar", "Beer");
  const isDev$ = of(true, true, false);
  zip(age$, name$, isDev$).subscribe(x => console.log(JSON.stringify(x)));
  // 27,"Foo",true]
  // [25,"Bar",true]
  // [29,"Beer",false]
  ```
- `combineLatest`,合并最后一个数据

  - combineLatest 合并数据流的方式是当任何一个上游 Observable 产生数据 时，从所有输入 Observable 对象中拿最后一次产生的数据(最新数据)， 然后把这些数据组合起来传给下游
  - 只要上游不产生新的数据，那 combineLatest 就会反复使用这个上游最后一次产生的数据。
  - !['combineLatest](https://rxjs.dev/assets/images/marble-diagrams/combineLatest.png)

  ```js
  import { combineLatest, timer } from "rxjs";

  const firstTimer = timer(0, 1000); // emit 0, 1, 2... after every second, starting from now
  const secondTimer = timer(500, 1000); // emit 0, 1, 2... after every second, starting 0,5s from now
  const combinedTimers = combineLatest(firstTimer, secondTimer);
  combinedTimers.subscribe(value => console.log(value));
  // Logs
  // [0, 0] after 0.5s
  // [1, 0] after 1s
  // [1, 1] after 1.5s
  // [2, 1] after 2s
  ```

- `withLatestFrom`,给下游推送数据只能由一个上游 Observable 对象驱动。

  - 产生的下游 Observable 对象中数据生成节奏只由一个输入 Observable 对象决定
  - !['withLatestFrom'](https://rxjs.dev/assets/images/marble-diagrams/withLatestFrom.png)

  ```js
  import { fromEvent, interval } from "rxjs";
  import { withLatestFrom } from "rxjs/operators";

  const clicks = fromEvent(document, "click");
  const timer = interval(1000);
  const result = clicks.pipe(withLatestFrom(timer));
  result.subscribe(x => console.log(x));
  ```

- `race`,胜者通吃

  - race 就是“竞争”，多个 Observable 对象在一起，看谁最先产生数据
  - 第一个吐出数据的 Observable 对象就是胜者，race 产生的 Observable 就 会完全采用胜者 Observable 对象的数据，其余的输入 Observable 对象则会被 退订而抛弃。

  ```js
  import { race, interval } from "rxjs";
  import { mapTo } from "rxjs/operators";

  const obs1 = interval(1000).pipe(mapTo("fast one"));
  const obs2 = interval(3000).pipe(mapTo("medium one"));
  const obs3 = interval(5000).pipe(mapTo("slow one"));

  race(obs3, obs1, obs2).subscribe(winner => console.log(winner));

  // result:
  // a series of 'fast one'
  ```

- `startWith`

  ```js
  import { of } from "rxjs";
  import { startWith } from "rxjs/operators";

  of("from source")
    .pipe(startWith("first", "second"))
    .subscribe(x => console.log(x));

  // results:
  //   "first"
  //   "second"
  //   "from source"
  ```

- `forkJoin`

  - 只有当所有上游 Observable 对象都完结，确定不会有新的数据产生的时候，forkJoin 就会把所有输入 Observable 对象产生的最后一个数据合并成给下游唯一的数据。
  - !['forkJoin'](https://rxjs.dev/assets/images/marble-diagrams/forkJoin.png)

  ```js
  import { forkJoin, of, timer } from "rxjs";
  // Use forkJoin with a dictionary of observable inputs
  const observable = forkJoin({
    foo: of(1, 2, 3, 4),
    bar: Promise.resolve(8),
    baz: timer(4000)
  });
  observable.subscribe({
    next: value => console.log(value),
    complete: () => console.log("This is how it ends!")
  });

  // Logs:
  // { foo: 4, bar: 8, baz: 0 } after 4 seconds
  // "This is how it ends!" immediately after

  // Use forkJoin with an array of observable inputs
  const observable = forkJoin([
    of(1, 2, 3, 4),
    Promise.resolve(8),
    timer(4000)
  ]);
  // Logs:
  // [4, 8, 0] after 4 seconds
  // "This is how it ends!" immediately after
  ```

- **高阶 Observable**
  - 所谓高阶 Observable，指的是产生的数据依然是 Observable 的 Observable。
  - 用 Observable 来管理多个 Observable 对象。
  - RxJS 提供对应的处理高阶 Observable 的合并类操作符，名称就是在原有操 作符名称的结尾加上 Al
- `concatAll`
  - concatAll 会对其 中的内部 Observable 对象做 concat 的操作
  - 和 concat 一样，如果前一个内部 Observable 没有完结，那么 concatAll 就 不会订阅下一个内部 Observable 对象
  - concatAll 首先会订阅上游产生的第一个内部 Observable 对象， 抽取其中的数据，然后，只有当第一个 Observable 对象完结的时候，才会 去订阅第二个内部 Observable 对象
  - !['concatAll'](https://rxjs.dev/assets/images/marble-diagrams/concatAll.png)
  ```js
  const source$ = interval(1000).pipe(
    take(2),
    map(x =>
      interval(1500).pipe(
        take(2),
        map(y => x + ":" + y)
      )
    ),
    concatAll()
  );
  source$.subscribe(console.log);
  //  0  --  1
  //     --      0:0   --    0:1
  //     --            1:0    --   1:1
  // 0:0
  // 0:1     // 第一层为 0 的结束了
  // 1:0
  // 1:1    // 第一层为 1 的结束了
  ```
- `mergeAll`
  - mergeAll 对内部 Observable 的订阅策略和 concatAll 不同，mergeAll 只要 发现上游产生一个内部 Observable 就会立刻订阅，并从中抽取收据
  ```js
  const source$ = interval(1000).pipe(
    take(2),
    map(x =>
      interval(1500).pipe(
        take(2),
        map(y => x + ":" + y)
      )
    ),
    mergeAll()
  );
  source$.subscribe(console.log);
  //  0  --  1
  //     --      0:0   --    0:1
  //     --            1:0    --   1:1
  // 0:0
  // 1:0          // 1:0 产生的时间在 0:1 之前
  // 0:1
  // 1:1
  ```
- `zipAll`
  - 两个内部 Observable 产生的数据一对一配对出现
  ```js
  const source$ = interval(1000).pipe(
    take(2),
    map(x =>
      interval(1500).pipe(
        take(2),
        map(y => x + ":" + y)
      )
    ),
    zipAll()
  );
  source$.subscribe(x => console.log(JSON.stringify(x)));
  //  0  --  1
  //     --      0:0   --    0:1
  //     --            1:0    --   1:1
  // ["0:0","1:0"]
  // ["0:1","1:1"]
  ```
- `combineAll`
  - combineAll 就是处理高阶 Observable 的 combineLatest
  ```js
  const source$ = interval(1000).pipe(
    take(2),
    map(x =>
      interval(1500).pipe(
        take(2),
        map(y => x + ":" + y)
      )
    ),
    combineAll()
  );
  source$.subscribe(x => console.log(JSON.stringify(x)));
  //  0  --  1
  //     --      0:0   --    0:1
  //     --            1:0    --   1:1
  // ["0:0","1:0"]
  // ["0:1","1:0"]
  // ["0:1","1:1"]
  ```
- `switchAll`

  - switch 的含义就是“切换”，总是切换到最新的内部 Observable 对象获取 数据。每当 switch 的上游高阶 Observable 产生一个内部 Observable 对象， switch 都会立刻订阅最新的内部 Observable 对象上，如果已经订阅了之前的 内部 Observable 对象，就会退订那个过时的内部 Observable 对象
  - !['switchAll'](https://rxjs.dev/assets/images/marble-diagrams/switchAll.png)

  ```js
  // 每次点击都会取消之前的订阅，订阅一个新的
  import { fromEvent, interval } from 'rxjs';
  import { switchAll, map, tap } from 'rxjs/operators';
  const clicks = fromEvent(document, 'click').pipe(tap(() => console.log('click')));
  const source = clicks.pipe(map((ev) => interval(1000)));
  source.pipe(
    switchAll()
  ).subscribe(x => console.log(x));
  /* Output
  click
  1
  2
  3
  4
  ...
  click
  1
  2
  3
  ...
  click
  ...
  ```

- `exhaust`,耗尽

  - 在耗尽当前内部 Observable 的数据之前不会切换到下一个内部 Observable 对象
  - 在消耗当前内部 Observable 期间产生的新 Observale 会被忽略
  - !['exhaust'](https://rxjs.dev/assets/images/marble-diagrams/exhaust.png)

  ```js
  // Run a finite timer for each click, only if there is no currently active timer
  import { fromEvent, interval } from "rxjs";
  import { exhaust, map, take } from "rxjs/operators";

  const clicks = fromEvent(document, "click");
  const higherOrder = clicks.pipe(map(ev => interval(1000).pipe(take(5))));
  const result = higherOrder.pipe(exhaust());
  result.subscribe(x => console.log(x));
  ```

- **辅助类操作符**
- `count`,统计数据个数
  - count 的作用是统计上游 Observable 对象吐出的所有数据个数
  - ![''](https://rxjs.dev/assets/images/marble-diagrams/count.png)
  ```js
  // Counts how many seconds have passed before the first click happened
  const seconds = interval(1000);
  const clicks = fromEvent(document, "click");
  const secondsBeforeClick = seconds.pipe(takeUntil(clicks));
  const result = secondsBeforeClick.pipe(count());
  result.subscribe(x => console.log(x));
  // Counts how many odd numbers are there between 1 and 7
  const numbers = range(1, 7);
  const result = numbers.pipe(count(i => i % 2 === 1));
  result.subscribe(x => console.log(x));
  // Results in:
  // 4
  ```
- `max`,`min`

  - max 是取得上游 Observable 吐出所有数据的“最大值”，而 min 是取得“最小值”
  - !['max'](https://rxjs.dev/assets/images/marble-diagrams/max.png)

  ```ts
  // Get the maximal value of a series of numbers
  of(5, 4, 7, 2, 8).pipe(max());
  // Use a comparer function to get the maximal item

  interface Person {
    age: number;
    name: string;
  }
  of<Person>(
    { age: 7, name: "Foo" },
    { age: 5, name: "Bar" },
    { age: 9, name: "Beer" }
  )
    .pipe(
      max<Person>((a: Person, b: Person) => (a.age < b.age ? -1 : 1))
    )
    .subscribe((x: Person) => console.log(x.name)); // -> 'Beer'
  ```

- `reduce`,规约统计
  - 类似 js 中，reduce
  - !['reduce'](https://rxjs.dev/assets/images/marble-diagrams/reduce.png)
  ```js
  // Count the number of click events that happened in 5 seconds
  const clicksInFiveSeconds = fromEvent(document, "click").pipe(
    takeUntil(interval(5000))
  );
  const ones = clicksInFiveSeconds.pipe(mapTo(1));
  const count = ones.pipe(reduce((acc, one) => acc + one, 0));
  count.subscribe(x => console.log(x));
  ```
- `every`

  - 上游 Observable 吐出的每一个数据 都会被这个判定函数检验，如果所有数据的判定结果都是 true，那么在上 游 Observable 对象完结的时候，every 产生的新 Observable 对象就会吐出一个 而且是唯一的布尔值 true;反之，只要上游吐出的数据中有一个数据检验 为 false，那么也不用等到上游 Observable 完结，every 产生的 Observable 对象 就会立刻吐出 false。

  ```js
  import { of } from "rxjs";
  import { every } from "rxjs/operators";

  of(1, 2, 3, 4, 5, 6)
    .pipe(every(x => x < 5))
    .subscribe(x => console.log(x)); // -> false
  ```

- `find`

  - 找到第一个通过测试的数据
  - !['find'](https://rxjs.dev/assets/images/marble-diagrams/find.png)

  ```js
  const clicks = fromEvent(document, "click");
  const result = clicks.pipe(find(ev => ev.target.tagName === "DIV"));
  result.subscribe(x => console.log(x));
  ```

- `findIndex`

  - 找到第一个通过测试的数据的序号
  - !['findIndex'](https://rxjs.dev/assets/images/marble-diagrams/findIndex.png)

- `isEmpty`

  - 检查一个上游 Observable 对象是不是“空的”
  - 如果是空的就结束了，吐出 true,如果上游 Observable 推送了数据，则会 吐出 false
  - 如果上游吐出 error,isEmpty 不会处理，他会继续等待上游推送数据或完成
  - !['isEmpty'](https://rxjs.dev/assets/images/marble-diagrams/isEmpty.png)

- `defaultIfEmpty`

  - 检测上游 Observable 对象是否为“空的”,接受一个默认值(default)作为参数，如果发现上游 Observable 对象 是“空的”，就把这个默认值吐出来给下游;如果发现上游 Observable 不 是“空的”，就把上游吐出的所有东西原样照搬转交给下游。
  - !['defaultIfEmpty'](https://rxjs.dev/assets/images/marble-diagrams/defaultIfEmpty.png)

  ```js
  // If no clicks happen in 5 seconds, then emit "no clicks"
  import { fromEvent } from "rxjs";
  import { defaultIfEmpty, takeUntil } from "rxjs/operators";

  const clicks = fromEvent(document, "click");
  const clicksBeforeFive = clicks.pipe(takeUntil(interval(5000)));
  const result = clicksBeforeFive.pipe(defaultIfEmpty("no clicks"));
  result.subscribe(x => console.log(x));
  ```

- **过滤数据流**
- `filter`,过滤

  - 使用一个判定函数,过滤掉不符合条件的数据
  - ![](https://rxjs.dev/assets/images/marble-diagrams/filter.png)
  - eg: `clicks.pipe(filter(x=>x%2===1));`

- `first`,第一个

  - 如果没判定条件，则返回第一个推送的数据
  - 如果有判定条件，则返回第一个满足条件的数据
  - ![](https://rxjs.dev/assets/images/marble-diagrams/first.png)

  ```js
  // first(predicate,defaultValue)
  const result = of(1, 2, 3, 4, 5, 6).pipe(first(x => x === 9, 99));
  result.subscribe(x => console.log(JSON.stringify(x)));
  ```

- `last`,最后一个

  - ![](https://rxjs.dev/assets/images/marble-diagrams/last.png)

- `take`,拿 n 个

  - Takes the first count values from the source, then completes.
  - ![](https://rxjs.dev/assets/images/marble-diagrams/take.png)

- `takeLast`,拿最后 n 个

  - 等待上游 Observable 完成后，再取最后 n 个
  - ![](https://rxjs.dev/assets/images/marble-diagrams/takeLast.png)

- `takeWhile`,

  - Takes values from the source only while they pass the condition given. When the first value does not satisfy, it completes.
  - ![](https://rxjs.dev/assets/images/marble-diagrams/takeWhile.png)

- `takeUntil`,takeUntil 让我们可以用 Observable 对象来控制另一个 Observable 对象的数据产生
  - Lets values pass until a second Observable, notifier, emits a value. Then, it completes.
  - ![](https://rxjs.dev/assets/images/marble-diagrams/takeUntil.png)
- `skip`

  - Returns an Observable that skips the first count items emitted by the source Observable.
  - ![](https://rxjs.dev/assets/images/marble-diagrams/skip.png)

- `skipWhile`

  - ![](https://rxjs.dev/assets/images/marble-diagrams/skipWhile.png)

- `skipUntil`

  - ![](https://rxjs.dev/assets/images/marble-diagrams/skipUntil.png)

- `throttleTime`

  - 我们希望一段时间内爆发的数据只有一个能够被处理到，这时候就应该使用 throttleTime

- `throttle`

  - 类似 `throttleTime`
  - 不同的是它不是用时间来控制流量，而是用 Observable 中的数据来控制流 量。
  - 在 durationSelector 完成或吐出值之前，会抑制新值的吐出

- `debounceTime`

  - 只要数据在以很快的速度持续产生时，那就不去处理它们，直到产生数据的速度停止下来，过了指定 ms 后，才会将数据传递到下游

- `debounce`
  - 类似 `debounceTime`
  - 不同的是它不是用时间来控制流量，而是用 Observable 中的数据来控制流 量。
  - 在 durationSelector 完成或吐出值之前，会抑制新值的吐出
- `auditTime`

  - 吐出静默时间内最后一个值
  - ![](https://rxjs.dev/assets/images/marble-diagrams/auditTime.png)

- `audit`

  - 类似 `audit`
  - 不同的是它不是用时间来控制流量，而是用 Observable 中的数据来控制流 量。
  - 在 durationSelector 完成或吐出值之前，会抑制新值的吐出
  - ![](https://rxjs.dev/assets/images/marble-diagrams/audit.png)

- `sampleTime`,取样

  - 一段时间内内，最接近的数据
  - sampleTime 不管上游 source\$产生数据的节奏怎样，完全根 据自己参数指定的毫秒数间隔节奏来给下游传递数据,表面上看 sampleTime 和 auditTime 非常像，auditTime 也会把时间块中最 后一个数据推给下游，但是对于 auditTime 时间块的开始是由上游产生数据 触发的，而 sampleTime 的时间块开始则和上游数据完全无关
  - sampleTime 的参数是 800，所以，sampleTime 实际上把时间分为 800 毫秒长 度的时间块，sampleTime 会记录每一个时间块上游推下来的最后一个数 据，到了每个时间块结尾，就把这个时间块上游的最后一个数据推给下 游。
  - 如果 sampleTime 发现一个时间块内上游没有产生数据，那在时 间块结尾也不会给下游传递数据
  - ![](https://rxjs.dev/assets/images/marble-diagrams/sampleTime.png)

- `sample`
  - 只有 当参数 notifer\$产生一个数据的时候，sample 就会从上次产生数据到现在的 时间段里提取最后一个数据传给下游
  - ![](https://rxjs.dev/assets/images/marble-diagrams/sample.png)
  ```js
  // On every click, sample the most recent "seconds" timer
  const seconds = interval(1000);
  const clicks = fromEvent(document, "click");
  const result = seconds.pipe(sample(clicks));
  result.subscribe(x => console.log(x));
  ```
- `distinct`

  - 只返回从没 出现过的数据，上游同样的数据只有第一次产生时会传给下游，其余的都 被舍弃掉了。
  - `distinct（keySelector，flushes）`
  - 如果上游产生的不同数据很 多，那么可能会造成内存泄露

  ```js
  // 根据 === 判断是否相同
  distinct();
  // 根据 name 字段比对
  distinct((p: Person) => p.name);
  // 每1000ms 清空一下 内部的HashSet
  distinct(v => v.id, interval(1000));
  ```

- `distinctUntilChanged`

  - 只和上一个数据进行比较

- `ignoreElments`

  - 忽略所有的元素
  - ![](https://rxjs.dev/assets/images/marble-diagrams/ignoreElements.png)

- `elementAt`

  - 返回特定下标的数据
  - ![](https://rxjs.dev/assets/images/marble-diagrams/elementAt.png)

- `single`
  - single 这个操作符用来检查上游是否只有一个满足对应条件的数据，如 果答案为“是”，就向下游传递这个数据;如果答案为“否”，就向下游传递一个异常。
  - ![](https://rxjs.dev/assets/images/marble-diagrams/single.png)

* **转化数据流**

- `map`,将每个元素用映射函数产生新的数据
- `mapTo`,将数据流中的每一个数据转换成同一个数据
- `pluck`,取出一个对象中的一个字段

  - ![](https://rxjs.dev/assets/images/marble-diagrams/pluck.png)

- 将上游数据放在数组中 传给下游的操作符都包含 buffer 这个词

- `bufferTime`

  - 将一段时间内的上游数据 放到数组中
  - 如果没有数据，会发送空数组
  - ![](https://rxjs.dev/assets/images/marble-diagrams/bufferTime.png)

- `bufferCount`

  - `bufferCount(bufferSize,startBufferEvery)`
  - bufferSize:缓冲区的最大容量
  - startBufferEvery:何时开启下一个缓冲区
  - ![](https://rxjs.dev/assets/images/marble-diagrams/bufferCount.png)

- `bufferWhen`

  - 收集过去的值作为数组。当开始收集值时，它调用一个函数，该函数返回一个 Observable，告诉何时关闭缓冲区并重新开始收集
  - ![](https://rxjs.dev/assets/images/marble-diagrams/bufferWhen.png)

- `bufferToggle`

  - 定义开始和结束的 Observable
  - ![](https://rxjs.dev/assets/images/marble-diagrams/bufferToggle.png)

- `buffer`

  - 数据会积累，直到 Observable 会发出值
  - ![](https://rxjs.dev/assets/images/marble-diagrams/buffer.png)

- 所有 xxxxMap 名称模式的操作符，都是一个 map 加上一个“砸平”操作的 组合
- xxxxMap 是,map 产生的是一个高阶 Observable 对象,然后再展平
- concatMap = map + concatAll
- mergeMap = map + mergeAll
- switchMap = map + switch
- exhaustMap = map + exhaust

- `concatMap`
  - 内部的第二个 Observable 要等到第一个 Observable 完结才能上场
  - ![](https://rxjs.dev/assets/images/marble-diagrams/concatMap.png)
- `mergeMap`
  - 只要内部 Observable 推送数据，就会立即 推送到下游
  - ![](https://rxjs.dev/assets/images/marble-diagrams/mergeMap.png)
- `switchMap`
  - 只要有新的内部 Observable 对象产生，就立刻退订之前的内部 Observable 对象，改为从最新的内部 Observable 对象拿数据
  - ![](https://rxjs.dev/assets/images/marble-diagrams/switchMap.png)
- `exhaustMap`
  - exhaustMap 对数据的处理策略和 switchMap 正好相反，先产生的内部 Observable 优先级总是更高，后产生的内部 Observable 对象被利用的唯一机 会，就是之前的内部 Observable 对象已经完结

- `expand`
  - 类似于mergeMap
  - 所有expand传递给下游的数据，同时也会传递给自己, 作为上游传来的数据
  - ![](https://rxjs.dev/assets/images/marble-diagrams/expand.png)

- `scan`
  - like reduce,累计上游传来的值,reduce 是上游完结后再输出，scan 是上游每次推送 都会输出一个值
  - ![](https://rxjs.dev/assets/images/marble-diagrams/scan.png)

- `mergeScan`
  - mergeScan类似于scan，不过规约函数返回的是Observable对象而不是 一个数据