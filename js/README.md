 script 引入方式：
html 静态<script>引入
js 动态插入<script>
<script defer>: 延迟加载，元素解析完成后执行
<script async>: 异步加载，但执行时会阻塞元素渲染

闭包
一个持有外部环境变量的函数就是闭包

当函数可以记住并访问所在的词法作用域，并且保持着对词法作用域的引用，即使函数是在当前作用域之外执行，就会形成闭包。

JSON.parse(JSON.stringify(obj)): 性能最快
具有循环引用的对象时，报错
当值为函数、undefined、或symbol时，无法拷贝


instanceof原理
能在实例的 原型对象链 中找到该构造函数的prototype属性所指向的 原型对象，就返回true。即:
// __proto__: 代表原型对象链
instance.[__proto__...] === instance.constructor.prototype

// return true


new运算符的执行过程
新生成一个对象
链接到原型: obj.__proto__ = Con.prototype
绑定this: apply
返回新对象(如果构造函数有自己 retrun 时，则返回该值)


类型转换
大家都知道 JS 中在使用运算符号或者对比符时，会自带隐式转换，规则如下:

-、*、/、% ：一律转换成数值后计算
+：

数字 + 字符串 = 字符串， 运算顺序是从左到右
数字 + 对象， 优先调用对象的valueOf -> toString
数字 + boolean/null -> 数字
数字 + undefined -> NaN


[1].toString() === '1'
{}.toString() === '[object object]'
NaN !== NaN 、+undefined 为 NaN


防抖 (debounce): 将多次高频操作优化为只在最后一次执行，通常使用的场景是：用户输入，只需再输入完成后做一次输入校验即可。
- 每次都取消定时器，重新设置定时器,定时器时间是间隔时间

节流(throttle): 每隔一段时间后执行一次，也就是降低频率，将高频操作优化成低频操作，通常使用场景: 滚动条事件 或者 resize 事件，通常每隔 100~500 ms执行一次即可。
- 如果有定时器，等待定时器触发，如果没有定时器，才设置定时器

// 显式绑定 this
bind(context)(...args)
// 依次传入参数
call(context,...args)
// 数组
apply(context,arr)



跨标签页通讯
不同标签页间的通讯，本质原理就是去运用一些可以 共享的中间介质，因此比较常用的有以下方法:
通过父页面window.open()和子页面postMessage

异步下，通过 window.open('about: blank') 和 tab.location.href = '*'

设置同域下共享的localStorage与监听window.onstorage
重复写入相同的值无法触发
会受到浏览器隐身模式等的限制
设置共享cookie与不断轮询脏检查(setInterval)
借助服务端或者中间层实现


array
some: 有一项返回true，则整体为true
every: 有一项返回false，则整体为false
unshift / shift: 头部推入和弹出，改变原数组，返回操作项
splice(start, number, value...): 返回删除元素组成的数组，value 为插入项，改变原数组



从输入 url 到展示的过程

DNS 解析
TCP 三次握手
发送请求，分析 url，设置请求报文(头，主体)
服务器返回请求的文件 (html)
浏览器渲染

HTML parser --> DOM Tree

标记化算法，进行元素状态的标记
dom 树构建


CSS parser --> Style Tree

解析 css 代码，生成样式树


attachment --> Render Tree

结合 dom树 与 style树，生成渲染树


layout: 布局
GPU painting: 像素绘制页面


1xx: 接受，继续处理
200: 成功，并返回数据
201: 已创建
202: 已接受
203: 成为，但未授权
204: 成功，无内容
205: 成功，重置内容
206: 成功，部分内容
301: 永久移动，重定向
302: 临时移动，可使用原有URI
304: 资源未修改，可使用缓存
305: 需代理访问
400: 请求语法错误
401: 要求身份认证
403: 拒绝请求
404: 资源不存在
500: 服务器错误
