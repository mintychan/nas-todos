import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TodoModel from './TodoModel';
import TodoItem from './TodoItem';
import TodoFooter from './Footer';
import Utils from './utils';

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const KEY = 'nas-todo';
const ENTER_KEY = 13;
const DappAddress = 'n1jvob6jtSHFkRet6Zq8Apc5GMV2n72goYH';

// hash: 90abe4867ef2df7f470381bf07b3bb35e484d14aaf5f355dfce62316792a6986

class App extends Component {
  constructor(props) {
    super(props);

    let todos = [];

    this.state = {
      nowShowing: ALL_TODOS,
      editing: null,
      todos: todos,
      newTodo: ''
    }

    this.model = new TodoModel(KEY)
  }

  componentDidMount() {
    let to = DappAddress;
    let value = "0";
    let callFunction = "forEach";
    let callArgs = "[\"300\",\"0\"]";
    var that = this;

    window.nebPay.simulateCall(to, value, callFunction, callArgs, {
      listener: function(response) {
        if(response) {

          if(response.result === "[]") {
            return [];
          } else {
            try {
              let todos = JSON.parse(response.result)

              that.setState({
                todos: todos
              })
            } catch (error) {
            }
          }
        }
      }
    });
  }

  handleChange = (event) => {
    this.setState({newTodo: event.target.value});
  }

  toggleAll = (event) => {
    var checked = event.target.checked;
    this.model.toggleAll(this, checked);
  }

  toggle = (todoToToggle) => {
    this.model.toggle(this, todoToToggle);
  }

  destroy = (todo) => {
    this.model.destroy(this, todo);
  }

  edit = (todo) => {
    this.setState({editing: todo.uuid});
  }

  save = (todoToSave, text) => {
    this.model.save(this, todoToSave, text);
    this.setState({editing: null});
  }

  cancel = () => {
    this.setState({editing: null});
  }

  clearCompleted = () => {
    this.model.clearCompleted(this);
  }

  handleNewTodoKeyDown = (event) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = this.state.newTodo.trim();

    if (val) {
      this.model.addTodo(this, val);
      this.setState({newTodo: ''});
    }
  }

  onCompleted = () => {
    this.setState({
      nowShowing: COMPLETED_TODOS
    })
  }

  onActive = () => {
    this.setState({
      nowShowing: ACTIVE_TODOS
    })
  }

  onAll = () => {
    this.setState({
      nowShowing: ALL_TODOS
    })
  }

  render() {
    var footer;
    var main;
    var todos = this.state.todos.filter(todo => todo.deleted !== true && todo.deleted !== 'true');

    var shownTodos = todos.
      filter(todo => {
      switch (this.state.nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
      }
    }, this);

    var todoItems = shownTodos.map(function (todo) {
      return (
        <TodoItem
          key={`${todo.uuid}-${todo.completed}`}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.uuid}
          onSave={this.save.bind(this, todo)}
          onCancel={this.cancel}
        />
      );
    }, this);

    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={this.clearCompleted}
          onCompleted={this.onCompleted}
          onActive={this.onActive}
          onAll={this.onAll}
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll}
            checked={activeTodoCount === 0}
          />
          <label
            htmlFor="toggle-all"
          />
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
      <div className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={this.state.newTodo}
            onKeyDown={this.handleNewTodoKeyDown}
            onChange={this.handleChange}
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
      <h4 style={{position: 'fixed', bottom: '0px', marginLeft: '200px'}}>Powered by Nebulas</h4>
      </div>
    );
  }
}

export default App;
