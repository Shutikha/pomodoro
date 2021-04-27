import React from 'react';
import './App.css';
import { Header } from './components/Header';
import { Info } from './components/Info';
import { AddTask } from './components/AddTask/AddTask';
import { TasksList } from './components/TasksList';

function App():JSX.Element {
  return (
    <div className="App">
      <Header/>
      <Info/>
      <AddTask/>
      <TasksList/>
    </div>
  );
}

export default App;
