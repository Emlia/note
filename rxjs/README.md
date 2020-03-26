### this is rxjs note

- [rxjs](/code/rxjs)
```html5
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
- [observale create](/code/rxjs/create/observable-create.html)
```js
 // 当我们使用 create() 方法创建 Observable 时，Observable 必须定义如何清理执行的资源。
    // 你可以通过在 function subscribe() 中返回一个自定义的 unsubscribe 函数。
    const { Observable } = rxjs
    const observable = Observable.create(observer => {
      observer.next(1)
      observer.next(2)
      observer.next(3)
      setTimeout(() => {
        observer.next(4);
        // observer.complete();
      }, 1000);
      // 追踪 interval 资源
      var intervalID = setInterval(() => {
        observer.next('hi');
      }, 200)
      // create 中需要自己定义 unsubscribe
      return function unsubscribe() {
        clearInterval(intervalID);
        console.log('observer cancel subscribe')
      };
    })
    console.log('just before subscribe');
    const subscription = observable.subscribe({
      next: x => console.log('got value ' + x),
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done'),
    })
    console.log('just after subscribe');
    // 3s 后取消订阅
    setTimeout(() => {
      subscription.unsubscribe()
    }, 3000);
```
