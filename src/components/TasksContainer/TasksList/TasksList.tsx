import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { ITask, Task } from '../Task/Task';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './taskslist.module.css';
export interface ITasks{
  tasks:ITask[],
  editingTaskId:number,
  handleCompletedChange: (id:number)=>void,
  handleDeleted: (id:number)=>void,
  handleTaskChange:(id:number,newText:string,newWeight:number)=>void,
  handleEditingStateChange: (id:number,isEditing:boolean)=>void,
}
export function TasksList({tasks,editingTaskId,handleEditingStateChange,handleCompletedChange,handleDeleted,handleTaskChange}:ITasks): JSX.Element {
 
  const SortableTask = SortableElement(Task);
  const css=`.fade-enter {
    max-height: 0;
    opacity: 0;
  }
  
  .fade-enter-active {
    max-height: 30px;
    opacity: 1;
    background-color: red;
    transition: all 500ms;
  }
  
  .fade-exit {
    max-height: 30px;
    opacity: 1;
    background-color: transparent;
  }
  
  .fade-exit-active {
    max-height: 0;
    opacity: 0;
    transition: all 500ms;
  }`;
  return (

    <ul>
      {tasks.map((task,index) => (


        <SortableTask
          index={index}
          key={task.id}
          id={task.id}
          isEditing={editingTaskId===task.id}
          text={task.text}
          isCompleted={task.isCompleted}
          pomodoroWeight={task.pomodoroWeight}
          pomodoroUsed={task.pomodoroUsed}
          handleCompletedChange={handleCompletedChange}
          handleDeleted={handleDeleted}
          handleTaskChange={handleTaskChange}
          handleEditingStateChange={handleEditingStateChange}

        />

      ))}

    </ul>

  );
}
    
