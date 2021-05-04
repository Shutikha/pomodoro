import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router';
import styles from './timersettings.module.css';
import Switch from 'react-switch';
import { FaSave } from 'react-icons/fa';
import { ThemeContext } from '../../../App';
import {EColors, Text} from '../../../utils/Text';
import classNames from 'classnames';
export interface ITimerSettings{
  developerMode:boolean,
  pomodoroDuration:number,
  shortBreakDuration:number,
  longBreakDuration:number,
  pomodorosBeforLonBreak:number,
  showNotifications:boolean,
  autoStopTimer: boolean
}
export function TimerSettings():JSX.Element|null {
  function init(setting:string):string|null {
    return localStorage.getItem(`PomodoroSettings-${setting}`); 

  }
  const [pomodoroDuration, setPomodoroDuration] = useState<number>(Number(init('pomodoroDuration')||25));
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(Number(init('shortBreakDuration')||5));
  const [longBreakDuration, setLongBreakDuration] = useState<number>(Number(init('longBreakDuration')||25));
  const [pomodorosBeforLonBreak, setPomodorosBeforLonBreak] = useState<number>(Number(init('pomodorosBeforLonBreak')||4));
  const [showNotifications, setShowNotifications] = useState<boolean>('true'===init('showNotifications')||false);
  const [autoStopTimer, setAutoStopTimer] = useState<boolean>(null===init('autoStopTimer')?true:'true'===init('autoStopTimer'));
  const [developerMode, setDeveloperMode] = useState<boolean>('true'===init('developerMode'));
  const ref = useRef<HTMLDivElement>(null);
  const history=useHistory();
  const isDarkMode = useContext(ThemeContext);
  const handleClick=(e:MouseEvent)=>{
    if(e.target instanceof Node && !ref.current?.contains( e.target)){
      history.push('/');
    }
  };
  useEffect(() => {
    document.addEventListener('click',handleClick);
    return () => {
      document.removeEventListener('click',handleClick);
    };
  }, []);
  const modalRootNode=document.querySelector('#modal-root');
  if(!modalRootNode)
    return null;
  const saveSettings=(setting:string, value:string|number|boolean)=>{
    localStorage.setItem(`PomodoroSettings-${setting}`, JSON.stringify(value));
  };
  const handleFormSubmit=(e:FormEvent)=>{
    e.preventDefault();
    saveSettings('pomodoroDuration',pomodoroDuration);
    saveSettings('shortBreakDuration',shortBreakDuration);
    saveSettings('showNotifications',showNotifications);
    saveSettings('longBreakDuration',longBreakDuration);
    saveSettings('pomodorosBeforLonBreak',pomodorosBeforLonBreak);
    saveSettings('autoStopTimer',autoStopTimer);
    saveSettings('developerMode',developerMode);
    history.push('/');
  };
  const modalClasses=classNames(
    styles.modal,
    isDarkMode?styles.modal_dark:''
  );
  const saveBtnClasses=classNames(
    styles.savePng,
    isDarkMode?styles.savePng_dark:''
  );
  return ReactDOM.createPortal( (
    <div className={styles.modal_mask}>
      <div className={styles.modal_wrapper}>

        <div className={modalClasses} ref={ref}>
          <h2 className={isDarkMode?styles.title_dark:''}>Настройки</h2>
          <div className={styles.content}>
            <form className={styles.form} onSubmit={(e)=>handleFormSubmit(e)}>
              <div>
                <label className={isDarkMode?styles.label_dark:''} htmlFor="pomodoroDuration">продолжительность «помидора»</label>
                <input type="number" name="pomodoroDuration" defaultValue={pomodoroDuration} onBlur={(e)=>setPomodoroDuration(Number(e.target.value))} />
                <span className={isDarkMode?styles.label_dark:''}> мин.</span>
              </div>
              <div>
                <label className={isDarkMode?styles.label_dark:''} htmlFor="shortBreakDuration">продолжительность короткого перерыва</label>
                <input type="number" name="shortBreakDuration" defaultValue={shortBreakDuration} onBlur={(e)=>setShortBreakDuration(Number(e.target.value))} />
                <span className={isDarkMode?styles.label_dark:''}> мин.</span>
              </div>
              <div>
                <label className={isDarkMode?styles.label_dark:''} htmlFor="longBreakDuration">продолжительность длинного перерыва</label>
                <input type="number" name="longBreakDuration" defaultValue={longBreakDuration} onBlur={(e)=>setLongBreakDuration(Number(e.target.value))} />
                <span className={isDarkMode?styles.label_dark:''}> мин.</span>
              </div>
              <div>
                <label className={isDarkMode?styles.label_dark:''} htmlFor="pomodorosBeforLonBreak">длинный перерыв каждые</label>
                <input type="number" name="pomodorosBeforLonBreak" defaultValue={pomodorosBeforLonBreak} onBlur={(e)=>setPomodorosBeforLonBreak(Number(e.target.value))} />
                <span className={isDarkMode?styles.label_dark:''}> помидора</span>
              </div>
              {/* <div>
                <label className={isDarkMode?styles.label_dark:''} htmlFor="notificationsEnabled">показывать уведомления</label>
                <Switch onChange={(val)=>setShowNotifications(val)} checked={showNotifications} name="notificationsEnabled" />
              </div> */}
              <div>
                <label className={isDarkMode?styles.label_dark:''} htmlFor="autoStopTimer">Автоматически останавливать таймер, если нет активных задач</label>
                <Switch onChange={(val)=>setAutoStopTimer(val)} checked={autoStopTimer} name="autoStopTimer" />
              </div>
              <div>
                <label className={isDarkMode?styles.label_dark:''} htmlFor="developerMode">Ускорить время (режим разработчика)</label>
                <Switch onChange={(val)=>setDeveloperMode(val)} checked={developerMode} name="developerMode" />
              </div>
              <button type='submit' className={styles.saveSettingsBtn} > <FaSave className={saveBtnClasses}/>&nbsp;<Text size={14} color={isDarkMode?EColors.orange:EColors.grey} >Сохранить</Text> </button>
            </form>
          </div>

           
        </div>
      </div>
    </div>
  ),modalRootNode);
}
