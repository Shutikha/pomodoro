import classNames from 'classnames';
import React, { useContext, useRef, useState } from 'react';
import { ThemeContext } from '../../App';
import styles from './statistics.module.css';
import {EColors, Text} from '../../utils/Text';
import { VerticalBarChart } from './VerticalBarChart';
import DatePicker, {registerLocale} from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import { Stops } from './Stops';
import { Pause } from './Pause';
import { Focus } from './Focus';
import { FaRegCalendarAlt } from 'react-icons/fa';
import ReactDatePicker from 'react-datepicker';


export function Statistics():JSX.Element {

  registerLocale('ru', ru);
  const isDarkMode = useContext(ThemeContext);
  const [statDate, setStatDate] = useState(new Date());
  const calendarRef = useRef<ReactDatePicker>(null);
  const pageClasses=classNames(
    styles.page,
    isDarkMode?styles.page_dark:''
  );
  const calendarClasses=classNames(
    styles.calendar,
    isDarkMode?styles.calendar_dark:''
  );

  function hanldeStatDateChange(date: Date | [Date, Date] | null): void {
    if(date instanceof Date )
      setStatDate(date);
  }

  const openCalendar=()=>{
    if(calendarRef.current){
      calendarRef.current.setOpen(true);
    }
  };
  return (
    <div className={pageClasses}>
      <div className={styles.header}>
        <Text As='h1' size={28} color={isDarkMode?EColors.grey:EColors.black} >
          Статистика за
          <div className={styles.datepicker}>
            <DatePicker className={calendarClasses}
              locale="ru"
              todayButton="Сегодня"
              selected={statDate}
              onChange={(date)=> hanldeStatDateChange(date) }
              dateFormat="dd MMMM yyyy"
              maxDate={new Date()}
              name='calendar'
              ref={calendarRef}

            />
            <button onClick={()=>openCalendar()} ><FaRegCalendarAlt className={isDarkMode? styles.calendarBtn_dark:styles.calendarBtn}/></button>
          </div>
        </Text>

      </div>

      <div className={styles.chartsBody}>


        <div className={styles.statContainer} >

          <VerticalBarChart date={statDate} />
        </div>

        <div className={styles.statContainer}>
          <Focus date={statDate}/>

        </div>
        <div className={styles.statContainer}>
          <Pause date={statDate} />

        </div>
        <div className={styles.statContainer}>
          <Stops date={statDate} />

        </div>








      </div>
    </div>
  );
}




