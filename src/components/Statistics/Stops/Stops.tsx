import React, { useContext } from 'react';

import {EColors, Text} from '../../../utils/Text';
import { ThemeContext } from '../../../App';
import styles from './stops.module.css';
interface IStops{
  date: Date
}
export function Stops({date}:IStops):JSX.Element {
  const isDarkMode = useContext(ThemeContext);
  const getStops=():unknown=>{
    const saved_stops=localStorage.getItem('Pomodoro-StatisticsStops');
    if( saved_stops ){

      const arr=new Map( JSON.parse(saved_stops));
 
      if (arr.has(date.toDateString())){
        return arr.get(date.toDateString());
      }

    }
    return 0;
  };

  return (
    <div className={styles.stops}>
      <Text size={28} color={isDarkMode?EColors.grey:EColors.black} >Остановки : </Text>
      <Text size={28} color={isDarkMode?EColors.lightseagreen:EColors.orange} > {getStops()}</Text>
    </div>
  );
}
