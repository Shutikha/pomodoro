import React, { useEffect } from 'react';
import { Timer } from './Timer';
import { CurrentPomodoro } from './CurrentPomodoro';
import styles from './timercontainer.module.css';
import { ETimerState, TimerControls } from './TimerControls';
import { useState } from 'react';
import { ITimerSettings } from './TimerSettings';

export interface ITimer {
  currentPomodoroDescription?: string,
  timerState: ETimerState,
  continueState: ETimerState,
  countdown: number,
  currentPomodoro: number,
  date?:string,

}
interface ITimerContainer{
  pomodoroDone:()=>void,
  getNumberOfPomodorosToDo: ()=>number,

}
export const TimerContainer = ({ pomodoroDone, getNumberOfPomodorosToDo}:ITimerContainer): JSX.Element => {

  const [timerSettings, setTimerSettings] = useState<ITimerSettings>({ developerMode: false, longBreakDuration: 25, shortBreakDuration: 5, pomodoroDuration: 25, showNotifications: false, autoStopTimer: true, pomodorosBeforLonBreak: 4 });
  const [timer, setTimer] = useState<ITimer>(initTimer());
  const [timerStarted, setTimerStarted] = useState(false);
  const [pauseTime, setPauseTime] = useState<number|null>(null);
  // const [startTime, setStartTime] = useState<number|null>(null);

  const [skipThisPomodoro, setSkipThisPomodoro] = useState<boolean>(false);

  function initTimer(): ITimer {
    const state = localStorage.getItem('Pomodoro-state');
    if (state) {
      const loaded_state= JSON.parse(state) as ITimer ;
      if(loaded_state.date && loaded_state.date===(new Date()).toDateString()){
        return loaded_state;
      }
    }
    return {
      currentPomodoro: 0,
      timerState: ETimerState.stopped,
      continueState: ETimerState.undefined,
      countdown: timerSettings.pomodoroDuration * 60,

    };

  }
  const getCurrentStateDescription = () => {
    switch (timer.timerState) {
    case ETimerState.working:
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
  const handleStartTimer = () => {

    setTimer({...timer,currentPomodoroDescription:'', currentPomodoro: 1, countdown: timerSettings.pomodoroDuration * 60, timerState: ETimerState.working, continueState: ETimerState.undefined });
    setTimerStarted(true);
    //setStartTime((new Date()).getTime());
  };
  const handleStopTimer = () => {
    setTimer({ ...timer, timerState: ETimerState.stopped });
    setTimerStarted(false);
    saveStatToLocalStorage('Pomodoro-StatisticsStops',1);
    // if(startTime){
    //   saveStatToLocalStorage('Pomodoro-StatisticsWorkMillisecs',(new Date()).getTime()-startTime);
    // }
    //setStartTime(null);
  };
  const handlePauseTimer = () => {
    setTimer({ ...timer, timerState: ETimerState.paused, continueState: timer.timerState });
    setTimerStarted(false);
    setPauseTime((new Date()).getTime());
  };
  const handleFastForwardTimer = () => {
    setSkipThisPomodoro(true);
    setTimer({ ...timer, countdown: 0 });

  };
  const handleContinueTimer = () => {
    setTimer({ ...timer, timerState: timer.continueState, continueState: ETimerState.undefined });
    setTimerStarted(true);
    if(pauseTime){
      saveStatToLocalStorage('Pomodoro-StatisticsPauseMillisecs',(new Date()).getTime() - pauseTime);
    }
    setPauseTime(null);
    // setStartTime((new Date()).getTime());
  };

  function saveStatToLocalStorage(stat:string,val:number) {
    const date=(new Date()).toDateString();
    const saved_stat=localStorage.getItem(stat);

    if( saved_stat ){
      const arr= new Map(JSON.parse(saved_stat));
      if (arr.has(date)){

        arr.set(date,val + Number(arr.get(date)));
        localStorage.setItem(stat, JSON.stringify([...arr]));
        return;
      }

    }

    localStorage.setItem(stat, JSON.stringify([...new Map([[date,val]])]));

  }
  function calculatePomodorosLeft(): number {
    const x= Math.max(0, Math.min(timerSettings.pomodorosBeforLonBreak - timer.currentPomodoro + 1, getNumberOfPomodorosToDo()));
    if(x===0 && timerStarted)
    {
      //no more active tasks
      setTimerStarted(false);
      setTimer({
        ...timer,
        timerState: ETimerState.stopped,
        currentPomodoroDescription: 'нет активных задач'
      });
    }
    return x;

  }

  //load timer setting on first page load
  useEffect(() => {
    setTimerSettings({
      longBreakDuration: Number(localStorage.getItem('PomodoroSettings-longBreakDuration'))||timerSettings.longBreakDuration,
      shortBreakDuration: Number(localStorage.getItem('PomodoroSettings-shortBreakDuration'))||timerSettings.shortBreakDuration,
      pomodoroDuration: Number(localStorage.getItem('PomodoroSettings-pomodoroDuration'))||timerSettings.pomodoroDuration,
      pomodorosBeforLonBreak: Number(localStorage.getItem('PomodoroSettings-pomodorosBeforLonBreak'))||timerSettings.pomodorosBeforLonBreak,
      showNotifications: 'true'===localStorage.getItem('PomodoroSettings-showNotifications'),
      autoStopTimer: null===localStorage.getItem('PomodoroSettings-autoStopTimer')?timerSettings.autoStopTimer:'true'===localStorage.getItem('PomodoroSettings-autoStopTimer'),
      developerMode: 'true'===localStorage.getItem('PomodoroSettings-developerMode'),
    });

  }, []);

  // run this effect when timer is started or stopped (paused)
  useEffect(() => {
    if (timerStarted) {
      //if autoStopTimer =true, we start only if we have active tasks
      if (timerSettings.autoStopTimer && getNumberOfPomodorosToDo()===0 ) {

        //no more active tasks
        setTimerStarted(false);//stop timer
        setTimer({
          ...timer,
          timerState: ETimerState.stopped,
          currentPomodoroDescription: 'нет активных задач'
        });
        return;
      }
      //start timer ticks
      //console.log('setInterval');

      const timerStep = timerSettings.developerMode ? 60 : 1;
      const intervalHandle = setInterval(() => {
        setTimer((prevState) => {
          if (prevState.countdown <= 0) {
            setTimerStarted(false);//this will stop timer
          }
          const new_state={ ...prevState, date:(new Date()).toDateString(), currentPomodoroDescription:'', countdown: Math.max(0, prevState.countdown - timerStep)};
          localStorage.setItem('Pomodoro-state', JSON.stringify({...new_state,timerState: ETimerState.paused, continueState: prevState.timerState}));
          saveStatToLocalStorage('Pomodoro-StatisticsWorkMillisecs',1000*timerStep);
          return new_state;
        });

      }, 1000);


      return () => {
        //console.log('clear interval');
        clearInterval(intervalHandle);
      };
    }
    else {

      //timer is ended so it's time to change state

      if (timer.timerState === ETimerState.working) {
        //console.log('short break or long break');
        //short break or long break
        const isLongBreak = timer.currentPomodoro + 1 > timerSettings.pomodorosBeforLonBreak;
        setTimer({
          ... timer,
          currentPomodoro: timer.currentPomodoro,
          timerState: isLongBreak ? ETimerState.longBreak : ETimerState.shortBreak,
          continueState: ETimerState.working,
          countdown: isLongBreak ? timerSettings.longBreakDuration * 60 : timerSettings.shortBreakDuration * 60
        });
        setTimerStarted(true);//start timer for break countdown
        if (!skipThisPomodoro) {
          pomodoroDone();
        }

      }
      else if (timer.timerState === ETimerState.shortBreak) {
        //console.log('begin next pomodoro');
        //begin next pomodoro
        setTimer({
          ... timer,
          currentPomodoro: timer.currentPomodoro + 1,
          timerState: ETimerState.working,
          continueState: ETimerState.working,
          countdown: timerSettings.pomodoroDuration * 60
        });
        setTimerStarted(true);//start timer
      }
      else if (timer.timerState === ETimerState.longBreak) {
        //console.log('start from the first pomodoro');
        //start from the first pomodoro
        setTimer({
          ... timer,
          currentPomodoro: 1,
          timerState: ETimerState.working,
          continueState: ETimerState.working,
          countdown: timerSettings.pomodoroDuration * 60
        });
        setTimerStarted(true);//start timer
      }
      // reset this flag in case we have set it before
      setSkipThisPomodoro(false);

    }
  }, [timerStarted]);
  return (
    <div className={styles.timerContainer}>
      <CurrentPomodoro title={getCurrentStateDescription()} description={timer.currentPomodoroDescription} pomodorosLeft={calculatePomodorosLeft()} showPommodoros={timer.timerState==ETimerState.working}/>
      <Timer countdown={timer.countdown} />
      <TimerControls timerState={timer.timerState} handleContinueTimer={handleContinueTimer} handleStopTimer={handleStopTimer} handleStartTimer={handleStartTimer} handlePauseTimer={handlePauseTimer} handleFastForwardTimer={handleFastForwardTimer}/>
    </div>
  );
};



