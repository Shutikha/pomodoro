import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import styles from './addtask.module.css';
import { FaPlusCircle } from 'react-icons/fa';
import { NOOP } from '../../../utils/noop';
import { ThemeContext } from '../../../App';
import classNames from 'classnames';
interface IAddTask{
  handleAddTask?:(text:string,pomodoroWeight:number)=>void
}
export function AddTask({handleAddTask=NOOP}:IAddTask):JSX.Element {
  const isDarkMode = useContext(ThemeContext);
  const [newTask, setNewTask] = useState<string>('');
  const [weight, setWeight] = useState<number>(1);

  const onTextChange = (e:ChangeEvent<HTMLInputElement>) => {
    setNewTask( e.target.value);
  };
  const onWeightChange = (e:ChangeEvent<HTMLInputElement>) => {
    setWeight( +(e.target.value));
  };

  const weightClasses=classNames(
    styles.weight,
    isDarkMode?styles.weight_dark:''
  );
  const addTaskClasses=classNames(
    styles.addTask,
    isDarkMode?styles.addTask_dark:''
  );
  const inputClasses=classNames(
    styles.input,
    isDarkMode?styles.input_dark:''
  );

  const handleSubmit = (e:FormEvent) => {
    
    e.preventDefault();
    if (newTask.trim()) {
      handleAddTask(newTask,weight);
      setNewTask('');
    } else {
      //todo: add 
    }
  };
  return (
    <form onSubmit={handleSubmit} className={addTaskClasses}>
      <input type='text' className={inputClasses} placeholder="добавьте задачу..." name="taskText" onChange={onTextChange} value={newTask} />
      <label htmlFor='weight' className={styles.weightLabel}>помидорок</label>
      <input type="number" name="weight" min='1' max='99' value={weight} className={weightClasses} onChange={onWeightChange}/>
      <button type='submit' className={styles.btn}><FaPlusCircle className={styles.addPng} /></button>
    </form>
  );
}
