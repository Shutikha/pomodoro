import React, { useContext } from 'react';
import styles from './focus.module.css';
import {EColors, Text} from '../../../utils/Text';
import { ThemeContext } from '../../../App';
import { getPauseHours, getWorkHours } from '../stat_utils';
interface IFocus{
  date: Date
}
export function Focus({date}:IFocus):JSX.Element {
  const isDarkMode = useContext(ThemeContext);
  const pauses=getPauseHours(date,false)[0];
  const works=getWorkHours(date,false)[0];
  const focus=works===0?0:(works-pauses)*100/works;
  return (
    <div>
      <Text size={28} color={isDarkMode?EColors.grey:EColors.black}>Фокус : </Text>
      <Text size={28} color={isDarkMode?EColors.lightseagreen:EColors.orange} > {focus.toFixed(1)} %</Text>
    </div>
  );
}
