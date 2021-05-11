import React, { useContext } from 'react';
import styles from './pause.module.css';
import {EColors, Text} from '../../../utils/Text';
import { ThemeContext } from '../../../App';
import { zeroPad } from '../../../utils/zeroPad';
import { getPauseTime } from '../stat_utils';
interface IPause{
  date: Date
}
export function Pause({date}:IPause):JSX.Element {
  const isDarkMode = useContext(ThemeContext);
  const PauseTime=():string=>{
    const val=getPauseTime(date);


    const hours = Math.floor(val / (1000 * 60 * 60));
    const minutes = Math.floor((val-hours*1000 * 60 * 60) / (1000 * 60));
    const seconds = Math.floor((val-hours*1000 * 60 * 60-minutes*1000 * 60) / 1000);

    return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;

  };

  return (
    <div className={styles.pause}>
      <Text size={28} color={isDarkMode?EColors.grey:EColors.black} >Время на паузе : </Text>
      <Text size={28} color={isDarkMode?EColors.lightseagreen:EColors.orange} > {PauseTime()}</Text>
    </div>
  );
}
