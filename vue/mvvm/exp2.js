

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
    const dep = new Dep();
    observe(val);
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function () {
            // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性
            // 暂存watcher, 添加完移除
            dep.depend();
            return val;
        },
        set: function (newVal) {
            val = newVal;
            dep.notify();
            // 通知所有订阅者
        }
    });
}


var uid = 0;

function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    depend: function () {
        console.log('添加 watch 到 依赖中')
        if (Dep.target) {
            this.addSub(Dep.target)
        }
    },
    removeSub: function (sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },
    notify: function () {
        console.log('触发 watch 的 update 回调')
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
};
// 全局的
Dep.target = null;


var data = { name: 'kindeng' };
observe(data);
console.log('触发 get -->')
const temp = data.name
console.log('触发 set -->')
data.name = 'dmq';