import React from 'react';
import { Timer } from './Timer';
import { CurrentPomodoro } from './CurrentPomodoro';
import styles from './timercontainer.module.css';
import { ETimerState, TimerControls } from './TimerControls';
interface ITimerContainer{
  handleStopTimer:()=>void,
  handleStartTimer:()=>void,
  handlePauseTimer:()=>void,
  handleFastForwardTimer:()=>void,
  handleContinueTimer:()=>void,
  currentPomodoro: string,
  currentPomodoroDescription?:string
  pomodorosLeft: number,
  timeout: string,
  timerState: ETimerState
}
export const TimerContainer= ({timerState,currentPomodoro,pomodorosLeft,currentPomodoroDescription,timeout,handleContinueTimer,handleStopTimer,handleStartTimer,handlePauseTimer,handleFastForwardTimer}:ITimerContainer): JSX.Element => {
  return (
    <div className={styles.timerContainer}>
      <CurrentPomodoro title={currentPomodoro} description={currentPomodoroDescription} pomodorosLeft={pomodorosLeft} showPommodoros={timerState==ETimerState.running}/>
      <Timer timeout={timeout} />
      <TimerControls timerState={timerState} handleContinueTimer={handleContinueTimer} handleStopTimer={handleStopTimer} handleStartTimer={handleStartTimer} handlePauseTimer={handlePauseTimer} handleFastForwardTimer={handleFastForwardTimer}/>
    </div>
  );
};
