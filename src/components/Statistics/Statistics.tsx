import classNames from 'classnames';
import React, { useContext, useState } from 'react';
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

enum Charts{
  WorkByMonth,
  Focus,
  PauseTime,
  Stops
}
export function Statistics():JSX.Element {

  registerLocale('ru', ru);
  const isDarkMode = useContext(ThemeContext);
  const [statDate, setStatDate] = useState(new Date());
  const [activeChart, setActiveChart] = useState<Charts>(Charts.WorkByMonth);
  const pageClasses=classNames(
    styles.page,
    isDarkMode?styles.page_dark:''
  );
  const calendarClasses=classNames(
    styles.calendar,
    isDarkMode?styles.calendar_dark:''
  );
  function handleChartSelect(chart: Charts): void {
    setActiveChart(chart);
  }
  function hanldeStatDateChange(date: Date | [Date, Date] | null): void {
    if(date instanceof Date )
      setStatDate(date);
  }
  const getFirstDayOfSelectedWeek=()=>{
    const result = new Date(statDate);
    result.setDate(result.getDate() - statDate.getDay());
    return result.toLocaleDateString('ru-RU');

  };
  
  const getLastDayOfSelectedWeek=()=>{
    const result = new Date(statDate);
    result.setDate(result.getDate() + 6- statDate.getDay());
    return result.toLocaleDateString('ru-RU');
  };

  return (
    <div className={pageClasses}>
      <div className={styles.header}>
        <Text As='h1' size={28} color={isDarkMode?EColors.grey:EColors.black} >Статистика</Text>

      </div>
      <div className={styles.tabsContainer}>
        <div className={styles.tab} onClick={()=>handleChartSelect(Charts.WorkByMonth)} >
          <div className={ activeChart===Charts.WorkByMonth?styles.activeTab:''}>
            <Text size={20} color={isDarkMode?EColors.grey:EColors.black}>Время работы с таймером </Text>
          </div>
        </div>
        <div className={styles.tab} onClick={()=>handleChartSelect(Charts.Focus)} >
          <div className={ activeChart===Charts.Focus?styles.activeTab:''}>
            <Text size={20} color={isDarkMode?EColors.grey:EColors.black} >Фокус</Text>
          </div>
        </div>
        <div className={styles.tab} onClick={()=>handleChartSelect(Charts.PauseTime)} >
          <div className={ activeChart===Charts.PauseTime?styles.activeTab:''}>
            <Text size={20} color={isDarkMode?EColors.grey:EColors.black} >Время на паузе</Text>
          </div>
        </div>
        <div className={styles.tab} onClick={()=>handleChartSelect(Charts.Stops)} >
          <div className={ activeChart===Charts.Stops?styles.activeTab:''}>
            <Text size={20} color={isDarkMode?EColors.grey:EColors.black} >Остановки</Text>
          </div>
        </div>
      </div>
      <div className={styles.chartsBody}>
        <div className={styles.calendarContainer}>
          <label htmlFor='calendar' > <Text size={18} color={isDarkMode?EColors.grey:EColors.black} >Выберите дату:</Text></label>
          <DatePicker className={calendarClasses}
            locale="ru"
            selected={statDate}
            onChange={(date)=> hanldeStatDateChange(date) }
            dateFormat="dd MMMM yyyy"
            maxDate={new Date()}
            name='calendar'

          />
        </div>
        { 
          activeChart===Charts.WorkByMonth && 
          <div className={styles.WorkByMonthChart}>

            <Text size={14} color={isDarkMode?EColors.grey:EColors.black}>Статистика за неделю с {getFirstDayOfSelectedWeek()} по {getLastDayOfSelectedWeek()} </Text>
            <VerticalBarChart period={statDate} />
          </div>
        }
        { 
          activeChart===Charts.Focus && 

            <Focus />

        }
        { 
          activeChart===Charts.PauseTime && 

            <Pause date={statDate} />

        }
        { 
          activeChart===Charts.Stops && 

            <Stops date={statDate} />

        }
      </div>
    </div>
  );
}




