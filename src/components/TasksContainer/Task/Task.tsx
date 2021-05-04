import React, { KeyboardEventHandler, useContext, useEffect, useRef, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { NOOP } from '../../../utils/noop';
import styles from './task.module.css';
import logo from '../../../logo.svg';
import { ThemeContext } from '../../../App';
import classNames from 'classnames';
import { MdMoreVert } from 'react-icons/md';
export interface ITask{
  id: number,
  text:string,
  isCompleted: boolean,
  pomodoroWeight: number,
  pomodoroUsed: number,
  handleCompletedChange?: (id:number)=>void,
  handleDeleted?: (id:number)=>void,
  handleTaskChange?:(id:number,newText:string,newWeight:number)=>void,
  handleEditingStateChange?: (id:number,isEditing:boolean)=>void,
  isEditing?:boolean
}
export function Task ({id,text,isCompleted,isEditing=false,pomodoroWeight,pomodoroUsed,handleEditingStateChange=NOOP,handleCompletedChange=NOOP,handleTaskChange=NOOP,handleDeleted=NOOP}:ITask): JSX.Element {
  const [editing, setEditing] = useState(isEditing);
  const refImputTaskText = useRef<HTMLTextAreaElement>(null);
  const refImputTaskWeight = useRef<HTMLInputElement>(null);
  const isDarkMode = useContext(ThemeContext);
  const textAreaAdjust=()=> {
    if( refImputTaskText.current){
      refImputTaskText.current.style.height = '1px';
      refImputTaskText.current.style.height = `${refImputTaskText.current.scrollHeight}px`;
    }
  };
  const handleUpdatedDone:KeyboardEventHandler<HTMLElement> = (event) => {
    if (event.key === 'Enter') {
      handleEditing(false);
      if( refImputTaskText.current && refImputTaskWeight.current){
        handleTaskChange(id,refImputTaskText.current.value,+(refImputTaskWeight.current.value));
      }
    }
  };
  const handleEditing=(isEditing:boolean)=>{
    handleEditingStateChange(id,isEditing);
    //setEditing(isEditing);
  };
  useEffect(() => {
    textAreaAdjust();
  }, [editing]);
  
  const viewMode = {display:''};
  const editMode = {display:''};
  const inputClasses=classNames(
    styles.textInput,
    isDarkMode?styles.textInput_dark:''
  );
  const weightClasses=classNames(
    styles.weight,
    isDarkMode?styles.weight_dark:''
  );

  if (editing) {
    viewMode.display = 'none';
  } else {
    editMode.display = 'none';
  }
  return (
    <li className={styles.taskItem}>
      <div onDoubleClick={()=>handleEditing(true)} style={viewMode} className={ styles.taskDiv}>
        <MdMoreVert className={styles.dragHandle} />
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isCompleted}
          onChange={() => handleCompletedChange(id)} />
        <span className={isCompleted ? styles.completedTask : styles.incompletedTask} >{text}</span>
        <span className={styles.pomodorosContainer}>
          {[...Array(pomodoroWeight)].map((_,i)=><img src={logo} alt='pomodoro' className={i<pomodoroUsed?styles.pomodoroUsed: styles.pomodoro} key={i}/>)}
        </span>
        <button className={styles.btn} onClick={() => handleEditing(true)}><FaEdit className={styles.editBtn} /></button>
        <button className={styles.btn} onClick={() => handleDeleted(id)}><FaTrash className={styles.deleteBtn} /></button>
      </div>
      <div style={editMode}>
        <textarea defaultValue={text} ref={refImputTaskText}
          className={inputClasses}
          onKeyDown={handleUpdatedDone}
        />
        <label htmlFor='weight' className={styles.weightLabel}>помидорок</label>
        <input type="number" name="weight" min='1' max='99' ref={refImputTaskWeight} defaultValue={pomodoroWeight} className={weightClasses} onKeyDown={handleUpdatedDone}/>
      </div>
    </li>
  );
}


