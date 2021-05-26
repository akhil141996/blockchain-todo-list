import React, { Component } from "react";
import TodoListContract from "./contracts/TodoList.json"
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    todoListContract: null,
    tasks: [],
    taskContent: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedTodoListNetwork = TodoListContract.networks[networkId];
      const todoListInstance = new web3.eth.Contract(
        TodoListContract.abi,
        deployedTodoListNetwork && deployedTodoListNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, todoListContract: todoListInstance }, this.getTasks);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getTasks = async () => {
    const { todoListContract } = this.state;

    const res = await todoListContract.methods.taskCount().call();
    let tasks = []
    for (let i = 1; i <= res; i++) {
      const task = await todoListContract.methods.tasks(i).call();
      console.log("🚀 ~ file: App.js ~ line 74 ~ App ~ getTasks= ~ task", task)
      tasks.push({
        id: task.id,
        content: task.content,
        completed: task.completed
      })
    }
    console.log("🚀 ~ file: App.js ~ line 67 ~ App ~ getTasks= ~ tasks", tasks)

    this.setState({ tasks: [...tasks], taskContent: null })

  }

  storeTask = (event) => {
    this.setState({ taskContent: event.target.value })
  }

  submitTask = async () => {
    try {
      console.log('submit tasks')
      const { accounts, todoListContract } = this.state;

      await todoListContract.methods.createTask(this.state.taskContent).send({ from: accounts[0] });
      this.setState({ taskContent: null }, this.getTasks)
    } catch (err) {
      console.log(err)
      alert(err.message)
    }
  }

  toggleTodo = async (id) => {
    try {
      console.log('toggle todo')
      const { accounts, todoListContract } = this.state;

      await todoListContract.methods.toggleCompleted(id).send({ from: accounts[0] });
      this.getTasks()
    } catch (err) {
      console.log(err)
      alert(err.message)
    }
  }



  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Todo App - Storing data in blockchain</h1>
        <input type="text" onChange={(event) => this.storeTask(event)} defaultValue={''}></input>
        <button onClick={() => this.submitTask()}>Submit</button>
        <hr></hr>
        {this.state.tasks.map(task => (
          <div key={task.id}>
            <input type="checkbox" checked={task.completed} onChange={() => this.toggleTodo(task.id)}></input>
            <span>{task.content}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
