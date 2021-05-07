import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { NotFound } from './components/NotFound';
import { Statistics } from './components/Statistics';
import { TasksContainer } from './components/TasksContainer';
import { TimerSettings } from './components/TimerContainer/TimerSettings';

export const ThemeContext = React.createContext(false);

function App():JSX.Element {
  const initDarkMode=():boolean=>{
    const mode =localStorage.getItem('Pomodoro-DarkMode'); 
    return mode===null?false:('true'===mode);
  };
  const handleDarkModeChange=(darkMode:boolean)=>{
    setDarkMode(darkMode);
    localStorage.setItem('Pomodoro-DarkMode',JSON.stringify( darkMode));
  };
  const [darkMode, setDarkMode] = useState<boolean>(initDarkMode());
  return (
    <ThemeContext.Provider value={darkMode}>
      <div className={darkMode? 'App-dark':'App'}>
        <BrowserRouter> 
          <Header handleDarkModeChange={handleDarkModeChange}/>
          <Switch>
            <Route exact path='/' >
              <TasksContainer />
            </Route> 
            <Route exact path='/timersettings' component={TimerSettings} />
            <Route exact path='/statistics' component={Statistics} />
            <Route path='*' component={NotFound} />
          </Switch>
        </BrowserRouter>
        <div id = 'modal-root'></div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
