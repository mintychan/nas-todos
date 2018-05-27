'use strict';

var TodoEntry = function (text) {
  if (text) {
    var o = JSON.parse(text);
    this.uuid = o.uuid;
    this.value = o.value;
    this.completed = o.completed === 'true';
    this.deleted = o.deleted === 'true'
  } else {
    this.uuid = '';
    this.value = '';
    this.completed = '';
    this.deleted = '';
    
  }
};

TodoEntry.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var TodoContract = function () {
  LocalContractStorage.defineMapProperty(this, "arrayMap");

  LocalContractStorage.defineProperty(this, "size");

  LocalContractStorage.defineMapProperty(this, "dataMap", {
    parse: function (text) {
      return new TodoEntry(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
};

TodoContract.prototype = {
  init: function () {
    this.size = 0;
  },

  len:function(){
    return this.size;
  },

  addTodo: function (uuid, value) {
    var todoEntry = new TodoEntry();
    todoEntry.uuid = uuid;
    todoEntry.value = value;
    todoEntry.completed = 'false';
    todoEntry.deleted = 'false';

    var index = this.size;

    this.arrayMap.set(index, uuid);
    this.dataMap.set(uuid, todoEntry);
    this.size += 1;
  },

  updateTodo: function (uuid, value) {
    var todoEntry = this.dataMap.get(uuid);
    todoEntry.value = value;

    this.dataMap.set(uuid, todoEntry);
  },

  toggleTodo: function (uuid) {
    var todoEntry = this.dataMap.get(uuid);
    todoEntry.completed = (todoEntry.completed === 'true' || todoEntry.completed === true) ? 'false' : 'true';

    this.dataMap.set(uuid, todoEntry);
  },

  destroyTodo: function (uuid) {
    var todoEntry = this.dataMap.get(uuid);
    todoEntry.deleted = 'true';

    this.dataMap.set(uuid, todoEntry);
  },

  toggleAll: function () {
    for(var i=0;i<this.size;i++){
      var uuid = this.arrayMap.get(i);
      var todoEntry = this.dataMap.get(uuid);

      todoEntry.completed = 'true';

      this.dataMap.set(uuid, todoEntry);
    }
  },

  clearCompleted: function () {
    for(var i=0;i<this.size;i++){
      var uuid = this.arrayMap.get(i);
      var todoEntry = this.dataMap.get(uuid);

      if(todoEntry.completed === 'true' || todoEntry.completed === true) {
        todoEntry.deleted = 'true';  
      }

      this.dataMap.set(uuid, todoEntry);
    }
  },

  get: function (uuid = '') {
    uuid = uuid.trim();
    if ( uuid === "" ) {
      throw new Error("empty uuid")
    }
    return this.dataMap.get(uuid);
  },

  forEach: function(limit="10", offset="0"){
    limit = parseInt(limit);
    offset = parseInt(offset);
    if(offset>this.size){
       throw new Error("offset is not valid");
    }
    var number = offset+limit;
    if(number > this.size){
      number = this.size;
    }
    var result  = [];
    for(var i=offset;i<number;i++){
        var key = this.arrayMap.get(i);
        var object = this.dataMap.get(key);
        result.push(object);
    }
    return result;
  }
};

module.exports = TodoContract;