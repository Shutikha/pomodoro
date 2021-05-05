import React, { useContext } from 'react';
import styles from './header.module.css';
import { NavLink } from 'react-router-dom';
import {EColors, Text} from '../../utils/Text';
import logo from '../../logo.svg';
import Switch from 'react-switch';
import classNames from 'classnames';
import { ThemeContext } from '../../App';

interface IHeader{

  handleDarkModeChange: (mode:boolean)=>void
}
export function Header({handleDarkModeChange}:IHeader): JSX.Element {
  const isDarkMode = useContext(ThemeContext);
  const navClasses=classNames(
    styles.nav,
    isDarkMode?styles.nav_dark:''
  );

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <NavLink to='/' exact>

          <img className={styles.logo} src={logo} alt='logo'/>

        </NavLink>
        <NavLink to='/' exact>

          <Text size={28} color={isDarkMode?EColors.orange:EColors.black} >Pomodoro</Text>

        </NavLink>
      </div>

      <div className={styles.navs}>

        <NavLink className={navClasses} to="/statistics" exact >Статистика</NavLink>
        <NavLink className={navClasses} to="/timersettings" exact>Настройки</NavLink>
        <div className={styles.theme}>

          <Switch height={20} handleDiameter={18} onChange={(val)=>handleDarkModeChange(val)} checked={isDarkMode} />
          <Text size={16} color={isDarkMode?EColors.orange:EColors.black}>темная тема</Text>


        </div>
      </div>

    </div>
  );
}
