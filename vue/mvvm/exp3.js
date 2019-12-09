

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

// dep

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
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
};
// 全局的
Dep.target = null;


// watch
// Watcher订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是: 
// 1、在自身实例化时往属性订阅器(dep)里面添加自己 2、自身必须有一个update()方法 
// 3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调

function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    // 此处为了触发属性的getter，从而在dep添加自己，结合Observer更易理解
    this.value = this.get();
}
Watcher.prototype = {
    update: function () {
        // 属性值变化收到通知
        var value = this.get(); // 取到最新值
        var oldVal = this.value;
        if (value !== oldVal) {
            console.log(`update-属性值发生变化 : ${oldVal} --> ${value}`)
            this.value = value;
            this.cb.call(this.vm, value, oldVal); // 执行Compile中绑定的回调，更新视图
        }
    },
    get: function () {
        Dep.target = this;	// 将当前订阅者指向自己
        var value = this.vm[this.exp];	// 触发getter，添加自己到属性订阅器中
        Dep.target = null;	// 添加完毕，重置
        return value;
    }
};





var data = { name: '123' };
observe(data);
new Watcher(data, 'name', function () {
    console.log('update-更新视图')
})
const temp = data.name
data.name = '456';
data.name = '789';