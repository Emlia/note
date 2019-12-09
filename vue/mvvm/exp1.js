var data = { name: 'kindeng' };
observe(data);
data.name = 'dmq'; // 监听到值变化了 kindeng --> dmq
const temp = data.name // 获取值-dmq

function observe(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  // 取出所有属性遍历
  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key]);
  });
};

function defineReactive(data, key, val) {
  observe(val); // 监听子属性
  Object.defineProperty(data, key, {
    enumerable: true, // 可枚举
    configurable: false, // 不能再define
    get: function () {
      console.log('获取值-' + val)
      return val;
    },
    set: function (newVal) {
      console.log('监听到值变化了 ', val, ' --> ', newVal);
      val = newVal;
    }
  });
}