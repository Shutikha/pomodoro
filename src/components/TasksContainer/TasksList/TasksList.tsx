import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { ITask, Task } from '../Task/Task';

import './taskslist.module.css';
export interface ITasks{
  tasks:ITask[],

  handleCompletedChange: (id:number)=>void,
  handleDeleted: (id:number)=>void,
  handleTaskChange:(id:number,newText:string,newWeight:number)=>void,

}
export function TasksList({tasks,handleCompletedChange,handleDeleted,handleTaskChange}:ITasks): JSX.Element {

  const SortableTask = SortableElement(Task);

  return (

    <ul>
      {tasks.map((task,index) => (


        <SortableTask
          index={index}
          key={task.id}
          id={task.id}
          text={task.text}
          isCompleted={task.isCompleted}
          pomodoroWeight={task.pomodoroWeight}
          pomodoroUsed={task.pomodoroUsed}
          handleCompletedChange={handleCompletedChange}
          handleDeleted={handleDeleted}
          handleTaskChange={handleTaskChange}

        />

      ))}

    </ul>

  );
}

