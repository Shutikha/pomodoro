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

}
interface ITimerContainer{
  pomodoroDone:()=>void,
  isAnyWork: ()=>boolean,

}
export const TimerContainer = ({ pomodoroDone, isAnyWork}:ITimerContainer): JSX.Element => {

  const [timerSettings, setTimerSettings] = useState<ITimerSettings>({ developerMode: false, longBreakDuration: 25, shortBreakDuration: 5, pomodoroDuration: 25, showNotifications: false, autoStopTimer: true, pomodorosBeforLonBreak: 4 });
  const [timer, setTimer] = useState<ITimer>(initTimer());
  const [timerStarted, setTimerStarted] = useState(false);
  const [pauseTime, setPauseTime] = useState<number|null>(null);

  const [skipThisPomodoro, setSkipThisPomodoro] = useState<boolean>(false);

  function initTimer(): ITimer {
    const state = localStorage.getItem('Pomodoro-state');
    if (state === null) {

      return {
        currentPomodoro: 0,
        timerState: ETimerState.stopped,
        continueState: ETimerState.undefined,
        countdown: timerSettings.pomodoroDuration * 60,
      };
    }

    return JSON.parse(state) as ITimer ;
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

    setTimer({ currentPomodoro: 1, countdown: timerSettings.pomodoroDuration * 60, timerState: ETimerState.working, continueState: ETimerState.undefined });
    setTimerStarted(true);
  };
  const handleStopTimer = () => {
    setTimer({ ...timer, timerState: ETimerState.stopped });
    setTimerStarted(false);
    saveStatToLocalStorage('Pomodoro-StatisticsStops',1);
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
      if (timerSettings.autoStopTimer && !isAnyWork() ) {

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
          localStorage.setItem('Pomodoro-state', JSON.stringify({ ...prevState, timerState: ETimerState.paused, continueState: prevState.timerState, countdown: Math.max(0, prevState.countdown - timerStep)}));
          return { ...prevState, countdown: Math.max(0, prevState.countdown - timerStep) };
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
      <CurrentPomodoro title={getCurrentStateDescription()} description={timer.currentPomodoroDescription} pomodorosLeft={timerSettings.pomodorosBeforLonBreak-timer.currentPomodoro+1} showPommodoros={timer.timerState==ETimerState.working}/>
      <Timer countdown={timer.countdown} />
      <TimerControls timerState={timer.timerState} handleContinueTimer={handleContinueTimer} handleStopTimer={handleStopTimer} handleStartTimer={handleStartTimer} handlePauseTimer={handlePauseTimer} handleFastForwardTimer={handleFastForwardTimer}/>
    </div>
  );
};

