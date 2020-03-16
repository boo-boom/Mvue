// 数据劫持
// var obj = {},
//     temp = null;
// Object.defineProperty(obj, "age", {
//   get: function() {
//     console.log("获取年龄", temp);
//     return temp;
//   },
//   set: function(newVal) {
//     console.log("设置年龄", newVal);
//     temp = newVal;
//   }
// });
// obj.age = 20;
// console.log("obj.age: ", obj.age);

function Mvue(options) {
  this.$options = options;
  this.$data = options.data;
  this.$el = document.querySelector(options.el);
  this.init();
}
Mvue.prototype.init = function() {
  // 数据劫持
  this.observer(this.$data);
  // 更新视图
  this.compile();
};
Mvue.prototype.observer = function(data) {
  Object.keys(data).forEach(function(key) {
    var dep = new Dep();
    var value = data[key];
    Object.defineProperty(data, key, {
      configurable: true,   // 是否可配置，默认false [true: 可进行修改]
      enumerable: true,     // 是否可枚举，默认false [true: 可进行循环]
      get: function() {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return value;
      },
      set: function(newVal) {
        if (value !== newVal) {
          value = newVal;
          dep.notify(newVal);
        }
      }
    });
  });
}
Mvue.prototype.compile = function() {
  this.compileNode(this.$el);
};
Mvue.prototype.compileNode = function(el) {
  var self = this;
  var childNodes = el.childNodes;
  var nodes = Array.prototype.slice.call(childNodes);
  nodes.forEach(function(node) {
    if (node.nodeType === 3) {
      // 文本
      var nodeContent = node.textContent;
      var reg = /\{\{\s*(\S*)\s*\}\}/;
      if (reg.test(nodeContent)) {
        node.textContent = self.$data[RegExp.$1];
        new Watcher(self, RegExp.$1, function(newVal) {
          node.textContent = newVal;
        });
      }
    } else if (node.nodeType === 1) {
      // 标签
      var attrs = Array.prototype.slice.call(node.attributes);
      attrs.forEach(function(attr) {
        var attrName = attr.name;
        var attrValue = attr.value;
        if (attrName.indexOf("v-") === 0) {
          attrName = attrName.substr(2);
          if (attrName === "model") {
            node.value = self.$data[attrValue];
          }
          node.addEventListener("input", function(e) {
            self.$data[attrValue] = e.target.value;
          });
          new Watcher(self, attrValue, function(newVal) {
            node.value = newVal;
          });
        }
      });
    }
    // 递归查找所有文本节点
    if (node.childNodes.length > 0) {
      self.compileNode(node);
    }
  });
};

// 发布订阅模式 / 观察者模式
// 发布者，收集订阅者
function Dep() {
  this.subs = [];
}
Dep.prototype.addSub = function(sub) {
  this.subs.push(sub);
};
Dep.prototype.notify = function(newVal) {
  this.subs.forEach(function(sub) {
    sub.update(newVal);
  });
};

// 订阅者，订阅的数据改变时执行相应的回调函数
function Watcher(vm, exp, cb) {
  Dep.target = this;
  vm.$data[exp];
  this.cb = cb;
  Dep.target = null;
};
Watcher.prototype.update = function(newVal) {
  this.cb(newVal);
  console.log("数据更新了！！！");
};

// var dep = new Dep();
// var watcher1 = new Watcher();
// var watcher2 = new Watcher();
// var watcher3 = new Watcher();
// dep.addSub(watcher1);
// dep.addSub(watcher2);
// dep.addSub(watcher3);
// dep.notify();








// function defineReactive(data, key, value) {
//   //递归调用，监听所有属性
//   // observer(value);
//   //   var dep = new Dep();
//   Object.defineProperty(data, key, {
//     get: function() {
//       //   if (Dep.target) {
//       //     dep.addSub(Dep.target);
//       //   }
//       return value;
//     },
//     set: function(newVal) {
//       //   if (value !== newVal) {
//       //     value = newVal;
//       //     dep.notify(); //通知订阅器
//       //   }
//       value = newVal;
//     }
//   });
// }

// function observer(data) {
//   if (!data || typeof data !== "object") {
//     return;
//   }
//   Object.keys(data).forEach(key => {
//     defineReactive(data, key, data[key]);
//   });
// }

// function Dep() {
//   this.subs = [];
// }
// Dep.prototype.addSub = function(sub) {
//   this.subs.push(sub);
// };
// Dep.prototype.notify = function() {
//   this.subs.forEach(sub => {
//     sub.update();
//   });
// };
// Dep.target = null;
