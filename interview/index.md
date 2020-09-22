- [defer](/note/interview/examples/exp1.html)
- `defer` 只适用于外部脚本文件
- 要求按照脚本的先后顺序执行，`example1.js`-> `example2.js` - 即使 `<script defer></script>`放在`<head></head>`中,也会延迟到`</html>`后再加载，先于`DOMContentLoaded`事件触发前执行
- 由于浏览器各自实现有所差异的问题，`defer`不一定严格按照顺序执行，不一定先于`DOMContentLoaded`执行

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>defer</title>
      <script>
        // DOMContentLoaded
        document.addEventListener("DOMContentLoaded", function () {
          console.log("DOMContentLoaded");
        });
        window.addEventListener("load", function () {
          console.log("load");
        });
      </script>
      <script defer src="exp1-1.js"></script>
      <script defer src="exp1-2.js"></script>
    </head>
    <body>
      <script>
        console.log("srcipt in body");
      </script>
    </body>
  </html>
  <!-- 
    srcipt in body
    defer 1-1
    defer 1-2
    DOMContentLoaded 
    load
  -->
  ```

- [async](/note/interview/examples/exp2.html)
- 与`defer`不同的是`async`不能保证按照他们的先后顺序执行
- `async`脚本一定在`load`之前，一般在`DOMContentLoaded`之后，也可能在`DOMContentLoaded`之前

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>async</title>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
      });
      window.addEventListener("load", function () {
        console.log("load");
      });
    </script>
    <script async src="exp2-1.js"></script>
    <script async src="exp2-2.js"></script>
    <script async src="exp2-3.js"></script>
  </head>
  <body>
    <script>
      console.log("srcipt in body");
    </script>
  </body>
</html>
<!-- 
  srcipt in body
  DOMContentLoaded
  async 2-1
  async 2-2
  async 2-3
  load
 -->
```

- `noscript`
- 浏览器不支持 js 或被禁用，会显示该标签的内容

```html
<noscript>
  <p>本页面需要支持（启用）JavaScript</p>
</noscript>
```

