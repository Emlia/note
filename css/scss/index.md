## `sass`和`scss`的区别

`sass` 缩进规则,以代码缩进代表大括号，换行代表分号

```sass
$font-stack: Helvetica, sans-serif
$primary-color: #333

body
  font: 100% $font-stack
  color: $primary-color
```

`scss` 代码都包裹在一对大括号里，并且末尾结束处都有一个分号

```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

**声明变量**

`$width : 300px;`

**默认变量**

`sass` 的默认变量仅需要在值后面加上 `!default` 即可

`sass` 的默认变量一般是用来设置默认值，然后根据需求来覆盖的，覆盖的方式也很简单，只需要在默认变量`之前`重新声明下变量即可。

```scss
$baseLineHeight: 2;
$baseLineHeight: 1.5 !default;
body {
  line-height: $baseLineHeight;
}
// 编译后
body {
  line-height: 2;
}
```

**全局变量和局部变量**

- `全局变量`就是定义在元素`外面`的变量
- `局部变量`定义在元素`内部`的变量
- `局部变量`只会在`局部范围内`覆盖`全局变量`

```scss
$size: 32px;
.title {
  font-size: $size;
}
.label {
  $size: 16px;
  font-size: $size;
}
//编译后
.title {
  font-size: 32px;
}
.label {
  font-size: 16px;
}
```

**选择器嵌套**

```scss
nav {
  a {
    color: red;
    header & {
      color: green;
    }
  }
}
// 编译后
nav a {
  color: red;
}
header nav a {
  color: green;
}
```

**属性嵌套**

`Sass` 中还提供属性嵌套，`CSS` 有一些属性前缀相同，只是后缀不一样，比如：`border-top`/`border-right`，与这个类似的还有 `margin、padding、font` 等属性

```scss
.box {
  border: {
    top: 1px solid red;
    bottom: 1px solid green;
  }
}
// css
.box {
  border-top: 1px solid red;
  border-bottom: 1px solid green;
}
```

**伪类嵌套**

其实伪类嵌套和属性嵌套非常类似，只不过他需要借助`&`符号一起配合使用

```scss
.clearfix {
  &:before,
  &:after {
    content: "";
    display: table;
  }
  &:after {
    clear: both;
    overflow: hidden;
  }
}
// css
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}

.clearfix:after {
  clear: both;
  overflow: hidden;
}
```

**不带参数混合宏**

在 Sass 中，使用`@mixin`来声明一个混合宏

```scss
@mixin border-radius {
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
.title {
  @include border-radius();
}
// css
.title {
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
```

**带参数混合宏**

```scss
// 声明参数时可以添加默认参数
@mixin border-radius($radius: 8px) {
  border-radius: $radius;
}
.title {
  @include border-radius();
}
// css
.title {
  border-radius: 8px;
}
```

当混合宏传的参数过多之时，可以使用参数`...`来替代

```scss
@mixin box-shadow($shadows...) {
  box-shadow: $shadows;
}
.shadows {
  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);
}
// css
.shadows {
  box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
}
```

**拓展/继承**

在 `Sass` 中是通过关键词 `@extend`来继承已存在的类样式块，从而实现代码的继承

```scss
.btn {
  border: 1px solid #ccc;
  padding: 6px 10px;
  font-size: 14px;
}
.btn-primary {
  background-color: #f36;
  color: #fff;
  @extend .btn;
}
// css
.btn,
.btn-primary {
  border: 1px solid #ccc;
  padding: 6px 10px;
  font-size: 14px;
}
.btn-primary {
  background-color: #f36;
  color: #fff;
}
```

**占位符 `%placeholder`**

`Sass` 中的占位符 `%placeholder` 功能是一个很强大,他可以取代以前 `CSS` 中的基类造成的代码冗余的情形。因为 `%placeholder` 声明的代码，如果不被 `@extend` 调用的话，不会产生任何代码

通过 `@extend` 调用的占位符，编译出来的代码会将相同的代码合并在一起

```scss
%mt5 {
  margin-top: 5px;
}
%pt5 {
  padding-top: 5px;
}
.btn {
  @extend %mt5;
  @extend %pt5;
}
.block {
  @extend %mt5;

  span {
    @extend %pt5;
  }
}
// scss
.btn,
.block {
  margin-top: 5px;
}

.btn,
.block span {
  padding-top: 5px;
}
```

**`混合宏` VS `继承` VS `占位符`**

`@mixin`,他`不会自动合并`相同的样式代码，如果在样式文件中调用同一个混合宏，会产生多个对应的样式代码，造成代码冗余,
但是他可以`传参数`

`个人建议`: 如果你的代码块中涉及到`变量`，建议使用混合宏来创建相同的代码块

`继承`,使用继承后，编译出来的 `CSS` 会将使用继承的代码块合并到一起，通过组合选择器的方式向大家展现.

`个人建议`: 如果你的代码块不需要专任何变量参数，而且有一个`基类`在文件中`已存在`，那么建议使用 `Sass` 的继承

`占位符`,`占位符`和`继承`基本类似,但`占位符`是独立定义，不调用的时候是不会在 `CSS` 中产生任何代码；继承是首先有一个`基类`存在，不管调用与不调用，`基类`的样式都将会出现在编译出来的 `CSS` 代码中

`个人建议`: 如果没有`基类`，又要复用代码，建议使用`占位符`

**插值#{}**

```scss
@mixin generate-sizes($class, $small, $medium, $big) {
  .#{$class}-small {
    font-size: $small;
  }
  .#{$class}-medium {
    font-size: $medium;
  }
  .#{$class}-big {
    font-size: $big;
  }
}
@include generate-sizes("header-text", 12px, 20px, 40px);
// css
.header-text-small {
  font-size: 12px;
}
.header-text-medium {
  font-size: 20px;
}
.header-text-big {
  font-size: 40px;
}
```

```scss
// 以下情况，不能使用插值
@mixin set-value($size) {
  margin-top: $margin-#{$size};
}
@include updated-#{$flag};
```

```scss
// @extend 中使用插值
%updated-status {
  margin-top: 20px;
}
.selected-status {
  font-weight: bold;
}
$flag: "status";
.navigation {
  @extend %updated-#{$flag};
  @extend .selected-#{$flag};
}
// css
.navigation {
  margin-top: 20px;
}
.selected-status,
.navigation {
  font-weight: bold;
}
```

**注释**

- `// 这是单行注释，不会被编译到css文件中`
- `/*这是多行注释,会被编译到css文件中用*/`

**数据类型**

- 数字: 如，`1`、 `2`、 `13`、 `10px`
- 字符串：`有引号字符串`或`无引号字符串`，如，`"foo"`、 `'bar'`、 `baz`
  > 使用 `#{ }`插值语句时，`有引号字符串`将被编译为`无引号字符串`
- 布尔型：如，`true`、 `false`
- 空值：如，`null`
- 值列表：用空格或者逗号分开，如，`1.5em 1em 0 2em` 、 `Helvetica, Arial, sans-serif`

  > 值列表中可以再包含值列表

  > 比如 1px 2px, 5px 6px 是包含 1px 2px 与 5px 6px 两个值列表的值列表

  > (1px 2px) (5px 6px)与 1px 2px 5px 6px 在编译后的 CSS 文件中是一样的，但是它们在 Sass 文件中却有不同的意义，前者是包含两个值列表的值列表，而后者是包含四个值的值列表

**加,减,乘,除**

携带不同类型的单位时，在 `Sass` 中计算会报错

```scss
.box {
  width: 20px + 80;
}
// css
.box {
  width: 100px;
}
```

> 特别的,`除法`需要`()`

以下情况，`/` 也能被识别成`除法`

- `/` 符号在已有的数学表达式中时 `width: 20px / 2 + 3;`
- 变量进行`除法`运算 `$width / 10`

> 特别地，`除法`运算中,如果两个值带有相同的单位值时，除法运算之后会得到一个不带单位的数值

```scss
.box {
  width: (20px / 2);
}
// css
.box {
  width: 10px;
}
```

**颜色计算**

- 所有算数运算都支持颜色值，并且是分段运算的。也就是说，红、绿和蓝各颜色分段单独进行运算
- 计算公式为 `01 + 04 = 05`、`02 + 05 = 07` 和 `03 + 06 = 09`

```scss
p {
  color: #010203 + #040506;
}
// css
p {
  color: #050709;
}
```

**字符运算**

在 Sass 中可以通过加法符号“+”来对字符串进行连接

- `$content: "Hello" + "" + "Sass!";`
- 带引号的字符串 + 无引号的字符串 => 带引号的字符串
- 无引号的字符串 + 带引号的字符串 => 无引号的字符串

```scss
p:before {
  content: "Foo " + Bar;
  font-family: sans- + "serif";
}
// css
p:before {
  content: "Foo Bar";
  font-family: sans-serif;
}
```

**@if,@else**

```scss
@mixin blockOrHidden($boolean: true) {
  @if $boolean {
    @debug "$boolean is #{$boolean}";
    display: block;
  } @else {
    @debug "$boolean is #{$boolean}";
    display: none;
  }
}
.block {
  @include blockOrHidden;
}
.hidden {
  @include blockOrHidden(false);
}
// css
.block {
  display: block;
}

.hidden {
  display: none;
}
```

**@for 循环**

```scss
@for $i from 1 through 3 {
  .item-#{$i} {
    width: 2em * $i;
  }
}
// css
.item-1 {
  width: 2em;
}
.item-2 {
  width: 4em;
}
.item-3 {
  width: 6em;
}
```

**@while**

```scss
$types: 2;
$type-width: 20px;

@while $types > 0 {
  .while-#{$types} {
    width: $type-width + $types;
  }
  $types: $types - 1;
}
// css
.while-2 {
  width: 22px;
}

.while-1 {
  width: 21px;
}
```

**@each 循环**

`@each` 循环就是去遍历一个列表，然后从列表中取出对应的值

```scss
$list: adam john wynn; //$list 就是一个列表
@mixin author-images {
  @each $author in $list {
    .photo-#{$author} {
      background: url("/images/avatars/#{$author}.png") no-repeat;
    }
  }
}
.author-bio {
  @include author-images;
}
// css
.author-bio .photo-adam {
  background: url("/images/avatars/adam.png") no-repeat;
}

.author-bio .photo-john {
  background: url("/images/avatars/john.png") no-repeat;
}

.author-bio .photo-wynn {
  background: url("/images/avatars/wynn.png") no-repeat;
}
```

**字符串函数-unquote()函数**

- **unquote(\$string)**：删除字符串中的引号
- **quote(\$string)**：给字符串添加引号

> **unquote( )** 函数只能删除字符串最前和最后的引号（双引号或单引号），而无法删除字符串中间的引号。如果字符没有带引号，返回的将是字符串本身。

```scss
.test1 {
  content: unquote("Hello Sass!");
}
// css
.test1 {
  content: Hello Sass!;
}
```

**字符串函数-To-upper-case()、To-lower-case()**

```scss
.test {
  content: to-upper-case("aaaaa");
  content: to-upper-case(aA-aAAA-aaa);
}
// css
.test {
  content: "AAAAA";
  content: AA-AAAA-AAA;
}
```

**数字函数**

- `percentage()`函数主要是将一个不带单位的数字转换成百分比形式

- `round()` 函数可以将一个数四舍五入为一个最接近的整数

- `ceil()` 函数将一个数转换成最接近于自己的整数，会将一个大于自身的任何小数转换成大于本身 1 的整数。也就是只做入，不做舍的计算

- `floor()` 函数刚好与 `ceil()` 函数功能相反，其主要将一个数去除其小数部分，并且不做任何的进位。也就是只做舍，不做入的计算

- `abs( )` 函数会返回一个数的绝对值

- `min()` 函数功能主要是在多个数之中找到最小的一个，这个函数可以设置任意多个参数

- `max()` 函数和 `min()` 函数一样，不同的是，`max()` 函数用来获取一系列数中的最大那个值

- `random()` 函数是用来获取一个 0-1 之间随机数

**列表函数**

- `length($list)` 返回一个列表的长度值

- `nth($list, $n)` 返回一个列表中指定的某个标签值

- `join($list1, $list2, [$separator])` 将两个列给连接在一起，变成一个列表

  ```
  join(a b c, d e f)
  结果: a b c d e f
  // $separator : comma | space
  join((a b c), (d e f), comma)
  结果: a, b, c, d, e, f
  join(a b c, d e f, $bracketed: true)
  结果: [a b c d e f]
  ```

- `append($list1, $val, [$separator])` 将某个值放在列表的最后

  ```
  append((a b c), d)
  结果: a b c d
  append((a b c), (d), comma)
  结果: a, b, c, d
  ```

- `zip($lists…)` 将几个列表结合成一个多维的列表

  ```
  zip(1px 2px 3px, solid dashed dotted, red green blue)
  结果: 1px solid red, 2px dashed green, 3px dotted blue
  ```

- `index($list, $value)`返回一个值在列表中的位置值

  ```
  index(a b c, b)
  结果: 2
  index(a b c, f)
  结果: null
  ```

**Introspection 函数**

- `type-of(value)`,返回值类型。返回值可以是 `number`, `string`, `color`, `list`, `map`, `bool`, `null`, `function`, `arglist。`

- `unit(number)`,返回传入数字的单位（或复合单位)

- `unitless(number)`,返回一个布尔值，判断传入的数字是否带有单位

- 三元判断,`if($condition,$if-true,$if-false)`

  ```scss
  .test {
    width: if(false, 1px, 2px);
    height: if(true, 1px, 2px);
  }
  // css
  .test {
    width: 2px;
    height: 1px;
  }
  ```

**Map**

`Sass` 的 `map` 常常被称为数据地图，也有人称其为数组，因为他总是以 `key:value` 成对的出现，但其更像是一个 `JSON` 数据

`map` 可以嵌套 `map`

```scss
$map: (
  $key1: value1,
  $key2: value2,
  $key3: value3,
);
```

- `map-get($map,$key)`,根据给定的 key 值，返回 map 中相关的值。
- `map-merge($map1,$map2)`,将两个 map 合并成一个新的 map。
- `map-remove($map,$key)`,从 map 中删除一个 key，返回一个新 map。
- `map-keys($map)`,返回 map 中所有的 key。
- `map-values($map)`,返回 map 中所有的 value。
- `map-has-key($map,$key)`,根据给定的 key 值判断 map 是否有对应的 value 值，如果有返回 true，否则返回 false。
- `keywords($args)`,返回一个函数的参数，这个参数可以动态的设置 key 和 value。

  > eywords($args) 函数可以说是一个动态创建 map 的函数。可以通过混合宏或函数的参数变创建 map。参数也是成对出现，其中 $args 变成 key(会自动去掉$符号)，而 $args 对应的值就是 value。

  ```scss
  @mixin map($args...) {
    @debug keywords($args);
  }

  @include map(
    $dribble: #ea4c89,
    $facebook: #3b5998,
    $github: #171515,
    $google: #db4437,
    $twitter: #55acee
  );
  // log
  debug: (
    dribble: #ea4c89,
    facebook: #3b5998,
    github: #171515,
    google: #db4437,
    twitter: #55acee
  );
  ```

**颜色函数**
[sass](https://www.runoob.com/sass/sass-color-func.html)
[sass](https://www.sasscss.com/documentation/modules/color)

- `rgb($red,$green,$blue)` 根据红、绿、蓝三个值创建一个颜色；
- `rgba($red,$green,$blue,$alpha)` 根据红、绿、蓝和透明度值创建一个颜色；
- `red($color)`：从一个颜色中获取其中红色值；
- `green($color)`：从一个颜色中获取其中绿色值；
- `blue($color)`：从一个颜色中获取其中蓝色值；
- `mix($color-1,$color-2,[$weight])`：把两种颜色混合在一起。
- `hsl($hue,$saturation,$lightness)`：通过色相（hue）、饱和度(saturation)和亮度（lightness）的值创建一个颜色；
- `hsla($hue,$saturation,$lightness,$alpha)`：通过色相（hue）、饱和度(saturation)、亮度（lightness）和透明（alpha）的值创建一个颜色；
- `hue($color)`：从一个颜色中获取色相（hue）值；
- `saturation($color)`：从一个颜色中获取饱和度（saturation）值；
- `lightness($color)`：从一个颜色中获取亮度（lightness）值；
- `adjust-hue($color,$degrees)`：通过改变一个颜色的色相值，创建一个新的颜色；
- `lighten($color,$amount)`：通过改变颜色的亮度值，让颜色变亮，创建一个新的颜色；
- `darken($color,$amount)`：通过改变颜色的亮度值，让颜色变暗，创建一个新的颜色；
- `saturate($color,$amount)`：通过改变颜色的饱和度值，让颜色更饱和，从而创建一个新的颜色
- `desaturate($color,$amount)`：通过改变颜色的饱和度值，让颜色更少的饱和，从而创建出一个新的颜色；
- `grayscale($color)`：将一个颜色变成灰色，相当于 `desaturate($color,100%)`;
- `complement($color)`：返回一个补充色，相当于 `adjust-hue($color,180deg)`;
- `invert($color)`：反回一个反相色，红、绿、蓝色值倒过来，而透明度不变。
- `alpha($color) /opacity($color)`：获取颜色透明度值；
- `rgba($color, $alpha)`：改变颜色的透明度值；
- `opacify($color, $amount) / fade-in($color, $amount)`：使颜色更不透明；
- `transparentize($color, $amount) / fade-out($color, $amount)`：使颜色更加透明。

**@import**

```scss
@import "foo.css";
@import "foo" screen;
@import "http://foo.com/bar";
@import url(foo);
```

**@media**

```scss
.sidebar {
  width: 300px;
  @media screen and (orientation: landscape) {
    width: 500px;
  }
}
// css
.sidebar {
  width: 300px;
}

@media screen and (orientation: landscape) {
  .sidebar {
    width: 500px;
  }
}
```

**@at-root**
`@at-root` 从字面上解释就是跳出根元素。当你选择器嵌套多层之后，想让某个选择器跳出，此时就可以使用 `@at-root`

```scss
.a {
  color: red;
  .b {
    color: orange;
    @at-root .c {
      color: green;
    }
  }
}
// css
.a {
  color: red;
}

.a .b {
  color: orange;
}

.c {
  color: green;
}
```

**@debug**

`@debug`在 Sass 中是用来调试的

**@warn,@error**

`@warn` ,`@error`和 `@debug`功能类似，用来帮助我们更好的调试 `Sass`
