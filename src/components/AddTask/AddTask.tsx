import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from './addtask.module.css';
import { FaPlusCircle } from 'react-icons/fa';

export function AddTask():JSX.Element {
  const [newTask, setNewTask] = useState('');
  const onChange = (e:ChangeEvent<HTMLInputElement>) => {
    setNewTask( e.target.value);
  };

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      // props.addTodoProps(newTask)
      setNewTask('');
    } else {
      //todo: add 
    }
  };
  return (
    <form onSubmit={handleSubmit} className={styles.addTask}>
      <input type='text' className={styles.input} placeholder="добавьте задачу..." name="title" onChange={onChange} />
      <button className={styles.addBtn}><FaPlusCircle /></button>
    </form>
  );
}
