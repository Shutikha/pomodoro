import React from 'react';
import { zeroPad } from '../../../utils/zeroPad';
import styles from './timer.module.css';
interface ITime{
  countdown:number
}

export function Timer({ countdown }: ITime):JSX.Element {
  const getTimerForDisplay = () => {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown - (hours * 3600 + minutes * 60);
    return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
  };
  return (
    <div className={styles.timer}>{getTimerForDisplay()}</div>
  );
}
