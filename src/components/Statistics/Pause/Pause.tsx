import React, { useContext } from 'react';
import styles from './pause.module.css';
import {EColors, Text} from '../../../utils/Text';
import { ThemeContext } from '../../../App';
import { zeroPad } from '../../../utils/zeroPad';
interface IPause{
  date: Date
}
export function Pause({date}:IPause):JSX.Element {
  const isDarkMode = useContext(ThemeContext);
  const getPauseTime=():any=>{
    const saved_stat=localStorage.getItem('Pomodoro-StatisticsPauseMillisecs');
    if( saved_stat ){
      const arr=new Map( JSON.parse(saved_stat));
 
      if (arr.has(date.toDateString())){
        const ms= arr.get(date.toDateString()) as number;
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(ms / (1000 * 60));
        const hours = Math.floor(ms / (1000 * 60 * 60));

        return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
      }

    }
    return 'Небыло остановок!';
  };

  return (
    <div className={styles.pause}>
      <Text size={18} color={isDarkMode?EColors.grey:EColors.black} >Время на паузе {date.toLocaleDateString('ru')} -&gt; </Text>
      <Text size={36} color={isDarkMode?EColors.lightseagreen:EColors.orange} > {getPauseTime()}</Text>
    </div>
  );
}
