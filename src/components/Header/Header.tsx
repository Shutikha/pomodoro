import React from 'react';
import styles from './header.module.css';
import { NavLink } from 'react-router-dom';
import {Text} from '../../utils/Text';
import logo from '../../logo.svg';

export function Header():JSX.Element {
  return (
    <div className={styles.header}>
     
      <img className={styles.logo} src={logo} alt='logo'/>

      <Text size={28}>Pomodoro</Text>

      <NavLink to="/statistics" exact>Статистика</NavLink>

    </div>
  );
}
