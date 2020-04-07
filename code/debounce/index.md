# debounce
> 防抖

````javascript
const debounce = (func, time = 17, optoins = {
  leading: true, context: null
}) => {
  let timer;
  const _debounce = function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    if (optoins.leading && !timer) {
      timer = setTimeout(null, time);
      func.apply(optoins.context, args)
    } else {
      timer = setTimeout(() => {
        func.apply(optoins.context, args)
        timer = null
      }, time);
    }
  }
  _debounce.cancel = function () {
    clearTimeout(timer)
    timer = null
  }
  return _debounce
}
````
