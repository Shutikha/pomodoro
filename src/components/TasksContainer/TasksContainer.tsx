import React, { useEffect, useState } from 'react';
import { SortableContainer, SortEnd, SortEvent } from 'react-sortable-hoc';
import { AddTask } from './AddTask';
import { Info } from './Info';
import { ITask } from './Task';
import styles from './taskscontainer.module.css';
import { TasksList } from './TasksList';
import arrayMove from 'array-move';
import { TimerContainer } from '../TimerContainer';
import { ETimerState } from '../TimerContainer/TimerControls';
import { ITimerSettings } from '../TimerContainer/TimerSettings';
import { zeroPad } from '../../utils/zeroPad';

export interface IState{
  currentPomodoro:number,
  currentPomodoroDescription?:string,
  timerState:ETimerState,
  continueState:ETimerState,
  timerCountdown:number,
  loadedFromStorage?:boolean  

}

export function TasksContainer(): JSX.Element {
  const [tasks, setTasks] = useState(getInitialTasks());
  const [timerSettings, setTimerSettings] = useState<ITimerSettings>({developerMode:false, longBreakDuration:25, shortBreakDuration:5, pomodoroDuration:25, showNotifications:false,autoStopTimer: true, pomodorosBeforLonBreak:4 });
  const [state, setState] = useState<IState>(initState());
  const [timerStarted, setTimerStarted] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number>(0);
  const [skipThisPomodoro, setSkipThisPomodoro] = useState<boolean>(false);
  useEffect(() => {
    if(timerStarted)
    {
      //if autoStopTimer =true, we start only if we have active tasks
      if(timerSettings.autoStopTimer && !tasks.find (x=>!x.isCompleted && x.pomodoroUsed<x.pomodoroWeight) ){
 
        //no more active tasks
        setTimerStarted(false);//stop timer           
        setState({
          ...state,
          timerState:ETimerState.stopped,
          currentPomodoroDescription:'нет активных задач'
        });
        return;
      }
      const timerStep=timerSettings.developerMode?60:1;
      const intervalHandle=setInterval(()=>{
        setState((prevState)=>{ 
          if(prevState.timerCountdown<=0)
          {
            setTimerStarted(false);
          } 
          return {...prevState, timerCountdown: Math.max(0, prevState.timerCountdown-timerStep)};
        });


      },1000);
    

      return () => {
        clearInterval(intervalHandle);
      };
    }
    else {

      //timer is ended so it's time to change state
      
      if(state.timerState===ETimerState.running){
        console.log('short break or long break');
        //short break or long break
        const isLongBreak=state.currentPomodoro+1>timerSettings.pomodorosBeforLonBreak;
        setState({
          currentPomodoro:state.currentPomodoro,
          timerState:isLongBreak?ETimerState.longBreak:ETimerState.shortBreak,
          continueState:ETimerState.running,
          timerCountdown:isLongBreak? timerSettings.longBreakDuration*60:timerSettings.shortBreakDuration*60 });
        setTimerStarted(true);//start timer for break countdown
        if(!skipThisPomodoro){
          //search tasks for first red pomodoro and mark it as used
          const topTask=tasks.find(x=>!x.isCompleted && x.pomodoroUsed<x.pomodoroWeight);
          if(topTask){
            setTasks( tasks.map(task=>{
              if(task.id===topTask.id){
                task.pomodoroUsed=task.pomodoroUsed+1;
              }
              return task;
            })
            );
          }
        }

      }
      else if(state.timerState===ETimerState.shortBreak){
        console.log('begin next pomodoro');
        //begin next pomodoro
        setState({
          currentPomodoro:state.currentPomodoro+1,
          timerState:ETimerState.running,
          continueState:ETimerState.running,
          timerCountdown: timerSettings.pomodoroDuration*60 });
        setTimerStarted(true);//start timer 
      }
      else if(state.timerState===ETimerState.longBreak){
        console.log('start from the first pomodoro');
        //start from the first pomodoro
        setState({
          currentPomodoro:1,
          timerState:ETimerState.running,
          continueState:ETimerState.running,
          timerCountdown: timerSettings.pomodoroDuration*60 });
        setTimerStarted(true);//start timer 
      }
      // reset this flag in case we have set it before
      setSkipThisPomodoro(false);
      
    }
  }, [timerStarted]);
  const SortableList = SortableContainer(TasksList);
  useEffect(() => {
    // save tasks
    localStorage.setItem('Pomodoro-Tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    //load timer setting on first page load
    setTimerSettings({
      longBreakDuration: Number(localStorage.getItem('PomodoroSettings-longBreakDuration'))||timerSettings.longBreakDuration,
      shortBreakDuration: Number(localStorage.getItem('PomodoroSettings-shortBreakDuration'))||timerSettings.shortBreakDuration,
      pomodoroDuration: Number(localStorage.getItem('PomodoroSettings-pomodoroDuration'))||timerSettings.pomodoroDuration,
      pomodorosBeforLonBreak: Number(localStorage.getItem('PomodoroSettings-pomodorosBeforLonBreak'))||timerSettings.pomodorosBeforLonBreak,
      showNotifications: 'true'===localStorage.getItem('PomodoroSettings-showNotifications'),
      autoStopTimer: null===localStorage.getItem('PomodoroSettings-autoStopTimer')?timerSettings.autoStopTimer:'true'===localStorage.getItem('PomodoroSettings-autoStopTimer'),
      developerMode: 'true'===localStorage.getItem('PomodoroSettings-developerMode'),
    });
    return ()=>{
      //save state to localStorage
      localStorage.setItem('Pomodoro-state', JSON.stringify(state));
    };
  }, []);

 
  function getInitialTasks():ITask[] {
    const savedTasks =localStorage.getItem('Pomodoro-Tasks'); 
    return savedTasks? JSON.parse(savedTasks) : [];
  }
  function initState():IState{
    const state=localStorage.getItem('Pomodoro-state');
    //console.log('loaded',state);
    if(state===null) {
      return {
        currentPomodoro:0,
        timerState:ETimerState.stopped,
        continueState:ETimerState.running, 
        timerCountdown:26*60,
      };
    }
    const x=JSON.parse(state) as IState;
    return {...x,loadedFromStorage:true};
  }
  const getTimerForDisplay=()=>{
    const hours=Math.floor(state.timerCountdown/3600);
    const minutes=Math.floor((state.timerCountdown%3600)/60);
    const seconds=state.timerCountdown-(hours*3600+minutes*60);
    return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
  };
  const getCurrentStateDescription=()=>{
    switch(state.timerState){
    case ETimerState.running:
      return 'Работаем. Осталось:';
    case ETimerState.stopped:
      return 'Остановлен';
    case ETimerState.paused:
      return 'Пауза';
    case ETimerState.longBreak:
      return 'Длинный перерыв';
    case ETimerState.shortBreak:
      return 'Короткий перерыв';
    default:
      return '?';
    }
  };
  const getPomodorosLeftToDisplay=()=>{
    switch(state.timerState){
    case ETimerState.running:
    case ETimerState.paused:
    case ETimerState.shortBreak:
      return timerSettings.pomodorosBeforLonBreak-state.currentPomodoro+1;
    case ETimerState.stopped:
    case ETimerState.longBreak:
    default:
      return 0;
    }   
  };
  const handleAddTask = (text:string,pomodoroWeight:number) => {
    const newTask:ITask = {
      id: new Date().getTime(),
      text: text,
      isCompleted: false,
      pomodoroWeight: pomodoroWeight,
      pomodoroUsed:0
    };
    setTasks( [...tasks, newTask]);
  };
  const handleCompletedChange = (id:number) => {
    setTasks(prevState =>
      prevState.map(task => {
        if (task.id === id) {
          return {
            ...task,
            isCompleted: !task.isCompleted,
          };
        }
        return task;
      })
    );
  };
  const handleTaskChange =(id:number,newText:string,newWeight:number)=>{
    setTasks( tasks.map(task=>{
      if(task.id===id){
        task.text=newText;
        task.pomodoroWeight=newWeight;
      }
      return task;
    })
    );
  };
  const handleEditingStateChange= (id:number,isEditing:boolean)=>{
  
    if(state.timerState===ETimerState.running ||state.timerState===ETimerState.shortBreak|| state.timerState===ETimerState.longBreak)
    {
      //if we have running timer, pause it 
      if(isEditing){
        handlePauseTimer();
      }

    }
    else if(state.timerState===ETimerState.paused && !isEditing){
      //when editing is done, continue timer 
      handleContinueTimer();
    }
    setEditingTaskId(isEditing?id:0);
  };
  const handleDeleted =(id:number)=>{
    setTasks( [...tasks.filter(task=>task.id!==id)] );
  };

  const handleStartTimer =()=>{

    setState({currentPomodoro: 1, timerCountdown: timerSettings.pomodoroDuration*60 , timerState: ETimerState.running, continueState: ETimerState.running });
    setTimerStarted(true);
  
  };
  const handleStopTimer =()=>{
    setState({...state, timerState: ETimerState.stopped });
    setTimerStarted(false);
  };
  const handlePauseTimer =()=>{
    setState({...state, timerState: ETimerState.paused, continueState:state.timerState });
    setTimerStarted(false);
  };
  const handleFastForwardTimer =()=>{
    setSkipThisPomodoro(true);
    setState({...state, timerCountdown:0 });

  };
  const handleContinueTimer =()=>{
    setState({...state, timerState: state.continueState });
    setTimerStarted(true);
  };

  function onSortStart(_: any, event:SortEvent){
    event.preventDefault();
  //  handlePauseTimer();
  }
  const onSortEnd = (e:SortEnd ) =>{
    setTasks(arrayMove(tasks, e.oldIndex, e.newIndex ));
  //  handleContinueTimer();
  };
 
  return (
    <>
      <div className={styles.tasksContainer}>
        <Info/>
        <AddTask handleAddTask={handleAddTask}/>
        <SortableList 
          tasks={tasks} 
          editingTaskId={editingTaskId}
          handleCompletedChange={handleCompletedChange} 
          handleTaskChange={handleTaskChange} 
          handleEditingStateChange={handleEditingStateChange}
          handleDeleted={handleDeleted} 
          onSortEnd={onSortEnd} 
          distance={5} 
          onSortStart={onSortStart }


        />
      </div>
      <TimerContainer 
        handleStopTimer={handleStopTimer} 
        handleStartTimer={handleStartTimer} 
        handlePauseTimer={handlePauseTimer} 
        handleContinueTimer={handleContinueTimer}
        handleFastForwardTimer={handleFastForwardTimer}
        currentPomodoro={getCurrentStateDescription()}
        currentPomodoroDescription={state.currentPomodoroDescription}
        pomodorosLeft={getPomodorosLeftToDisplay()}
        timeout={getTimerForDisplay()}
        timerState= {state.timerState}
      />
    </>
  );
}
