import React, { useContext } from 'react';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { MdFastForward } from 'react-icons/md';
import { ThemeContext } from '../../../App';
import {EColors, Text} from '../../../utils/Text';
import styles from './timercontrols.module.css';

export enum ETimerState {paused,stopped,running,shortBreak,longBreak}
export interface ITimerControls{
  handleStopTimer:()=>void,
  handleStartTimer:()=>void,
  handlePauseTimer:()=>void,
  handleContinueTimer:()=>void,
  handleFastForwardTimer:()=>void,
  timerState: ETimerState
}
export function TimerControls({timerState,handleContinueTimer, handleStopTimer,handleStartTimer,handlePauseTimer,handleFastForwardTimer}:ITimerControls):JSX.Element {
  const isDarkMode = useContext(ThemeContext);
  return (
    <div className={styles.controls} >
      { timerState===ETimerState.stopped && <button onClick={handleStartTimer} ><FaPlay className={isDarkMode?styles.darkControlBtn:''}/><Text size={10} color={isDarkMode?EColors.orange:EColors.grey}>Старт</Text></button>}
      { timerState===ETimerState.paused && <button onClick={handleContinueTimer} ><FaPlay className={isDarkMode?styles.darkControlBtn:''}/><Text size={10} color={isDarkMode?EColors.orange:EColors.grey}>Продолжить</Text></button>}
      {(timerState!==ETimerState.paused && timerState!==ETimerState.stopped) && <button onClick={handleStopTimer} ><FaStop className={isDarkMode?styles.darkControlBtn:''}/><Text size={10} color={isDarkMode?EColors.orange:EColors.grey}>Стоп</Text></button>}
      {(timerState!==ETimerState.paused && timerState!==ETimerState.stopped) && <button onClick={handlePauseTimer} ><FaPause className={isDarkMode?styles.darkControlBtn:''}/><Text size={10} color={isDarkMode?EColors.orange:EColors.grey}>Пауза</Text></button>}
      {(timerState===ETimerState.shortBreak ||ETimerState.longBreak ||timerState===ETimerState.paused || timerState===ETimerState.running) && <button onClick={handleFastForwardTimer} ><MdFastForward className={isDarkMode?styles.darkControlBtn:''}/><Text size={10} color={isDarkMode?EColors.orange:EColors.grey}>Пропустить</Text></button>}
    </div>
  );
}
