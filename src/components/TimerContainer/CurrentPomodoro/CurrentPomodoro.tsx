import React, { useContext } from 'react';
import styles from './CurrentPomodoro.module.css';
import {EColors, Text} from '../../../utils/Text';
import logo from '../../../logo.svg';
import { ThemeContext } from '../../../App';
export interface ICurrentPomodoro{
  title:string,
  description?:string,
  pomodorosLeft:number,
  showPommodoros:boolean 
}
export function CurrentPomodoro({title,description,pomodorosLeft,showPommodoros}:ICurrentPomodoro):JSX.Element {
  const isDarkMode = useContext(ThemeContext);
  return (
    <div className={styles.container}>
      <div >
        <Text size={36} color={isDarkMode?EColors.orange:EColors.black} >{title}&nbsp;
          {showPommodoros && [...Array(pomodorosLeft)].map((_,i)=><img src={logo} alt='pomodoro' className={styles.pomodoro} key={i}/>)}
        </Text>
      </div>
      { description && <div >
        <Text size={18} color={isDarkMode?EColors.grey:EColors.black} >{description} </Text>
      </div>
      }
    </div>
  );
}
