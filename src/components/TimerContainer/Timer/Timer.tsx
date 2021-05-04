import React from 'react';
import styles from './timer.module.css';

export interface ITimer{
  timeout: string
}
export function Timer({timeout}:ITimer):JSX.Element {
  return (
    <div className={styles.timer}>{timeout}</div>
  );
}
