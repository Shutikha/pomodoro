import React, { useContext, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { ThemeContext } from '../../../App';
import styles from './info.module.css';

export function Info():JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const isDarkMode = useContext(ThemeContext);
  return (
    <div className={styles.info}>
      <div className={styles.infoHeader} >Краткая инструкция по работе с приложением: </div>
      {isCollapsed && <div className={styles.expand}><button onClick={()=>setIsCollapsed(!isCollapsed)}><MdExpandMore className={isDarkMode?styles.darkMore:''}/></button></div>}
      {!isCollapsed &&
      <div>
        <ul>
          <li>Запланируйте несколько задач на свой день и для каждой задайте примерное количество «помидоров», которое необходимо, чтобы её сделать</li>
          <li>Задачи можно перетаскивать мышкой, верхняя задача из списка — это текущая задача</li>
          <li>Запустите таймер. Каждую «помидорка» длится 25 мин, между ними перерыв 5 мин. После четырех «помидорок» длинный перерыв 25 мин. Интервалы можно изменить в настройках </li>
          <li>Можно поставить таймер на паузу и пропустить «помидорку» или перерыв</li>
          <li>Можно остановить таймер, это сбросит счетчик использованных «помидорок»</li>
          <li>Каждая использованная «помидорка» сжигает запланированные «помидорку» в списке задач</li>
          <li>Отмечайте галочкой выполненные задачи</li>
          <li>Таймер остановится автоматически (можно изменить в настройках) как только сгорят все запланированные «помидорки» или не останется невыполненных задач</li>
        </ul>
        <div className={styles.expand}><button onClick={()=>setIsCollapsed(!isCollapsed)} ><MdExpandLess className={isDarkMode?styles.darkMore:''}/></button></div>
      </div>
      }
    </div>
  );
}
