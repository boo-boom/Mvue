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
    var value = data[key];
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function() {
        return value;
      },
      set: function(newVal) {
        value = newVal;
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
      }
    } else if (node.nodeType === 1) {
      // 标签
      // console.log(node);
    }
    // 递归查找所有文本节点
    if (node.childNodes.length > 0) {
      self.compileNode(node);
    }
  });
};
















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
