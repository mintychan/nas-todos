import Utils from './utils';
const DappAddress = 'n1jvob6jtSHFkRet6Zq8Apc5GMV2n72goYH';

var TodoModel = function (key) {
  this.key = key;
};


TodoModel.prototype.addTodo = function (app, title) {
  var to = DappAddress;
  var value = "0";
  var callFunction = "addTodo";
  var callArgs = "[\"" + Utils.uuid() + "\",\"" + title + "\"]";
  
  window.nebPay.call(to, value, callFunction, callArgs, {
    listener: function(resp) {
    }
  });
};

TodoModel.prototype.toggleAll = function (app, checked) {
  var to = DappAddress;
  var value = "0";
  var callFunction = "toggleAll";
  var callArgs = "[]";
  
  window.nebPay.call(to, value, callFunction, callArgs, {
    listener: function(resp) {
    }
  });
};

TodoModel.prototype.toggle = function (app, todo) {
  var to = DappAddress;
  var value = "0";
  var callFunction = "toggleTodo";
  var callArgs = "[\"" + todo.uuid + "\"]";
  
  window.nebPay.call(to, value, callFunction, callArgs, {
    listener: function(resp) {
    }
  });
};

TodoModel.prototype.destroy = function (app, todo) {
  var to = DappAddress;
  var value = "0";
  var callFunction = "destroyTodo";
  var callArgs = "[\"" + todo.uuid + "\"]";
  
  window.nebPay.call(to, value, callFunction, callArgs, {
    listener: function(resp) {
    }
  });
};

TodoModel.prototype.save = function (app, todoToSave, text) {
  var to = DappAddress;
  var value = "0";
  var callFunction = "updateTodo";
  var callArgs = "[\"" + todoToSave.uuid + "\",\"" + text + "\"]";
  
  window.nebPay.call(to, value, callFunction, callArgs, {
    listener: function(resp) {
    }
  });
};

TodoModel.prototype.clearCompleted = function (app) {
  var to = DappAddress;
  var value = "0";
  var callFunction = "clearCompleted";
  var callArgs = "[]";
  
  window.nebPay.call(to, value, callFunction, callArgs, {
    listener: function(resp) {
    }
  });
};

export default TodoModel;