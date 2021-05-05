import React, { useEffect, useState } from 'react';
import { SortableContainer, SortEnd, SortEvent } from 'react-sortable-hoc';
import { AddTask } from './AddTask';
import { Info } from './Info';
import { ITask } from './Task';
import styles from './taskscontainer.module.css';
import { TasksList } from './TasksList';
import arrayMove from 'array-move';
import { TimerContainer } from '../TimerContainer';


export function TasksContainer(): JSX.Element {
  const [tasks, setTasks] = useState(getInitialTasks());
  const SortableList = SortableContainer(TasksList);
  useEffect(() => {
    // save tasks
    localStorage.setItem('Pomodoro-Tasks', JSON.stringify(tasks));
  }, [tasks]);



  function getInitialTasks():ITask[] {
    const savedTasks =localStorage.getItem('Pomodoro-Tasks');
    return savedTasks? JSON.parse(savedTasks) : [];
  }


  const handleAddTask = (text:string,pomodoroWeight:number) => {
    const newTask:ITask = {
      id: new Date().getTime(),
      text: text,
      isCompleted: false,
      pomodoroWeight: pomodoroWeight,
      pomodoroUsed:0
    };
    setTasks( [...tasks, newTask]);
  };
  const handleCompletedChange = (id:number) => {
    setTasks(prevState =>
      prevState.map(task => {
        if (task.id === id) {
          return {
            ...task,
            isCompleted: !task.isCompleted,
          };
        }
        return task;
      })
    );
  };
  const handleTaskChange =(id:number,newText:string,newWeight:number)=>{
    setTasks( tasks.map(task=>{
      if(task.id===id){
        task.text=newText;
        task.pomodoroWeight=newWeight;
      }
      return task;
    })
    );
  };

  const handleDeleted =(id:number)=>{
    setTasks( [...tasks.filter(task=>task.id!==id)] );
  };


  function onSortStart(_: any, event:SortEvent){
    event.preventDefault();
  //  handlePauseTimer();
  }
  const onSortEnd = (e:SortEnd ) =>{
    setTasks(arrayMove(tasks, e.oldIndex, e.newIndex ));
  //  handleContinueTimer();
  };

  const isAnyWork=():boolean=>{
    return tasks.some(x => !x.isCompleted && x.pomodoroUsed < x.pomodoroWeight);
  };
  const pomodoroDone=()=>{
    //search tasks for first red pomodoro and mark it as used
    const topTask = tasks.find(x => !x.isCompleted && x.pomodoroUsed < x.pomodoroWeight);
    if (topTask) {
      setTasks(tasks.map(task => {
        if (task.id === topTask.id) {
          task.pomodoroUsed = task.pomodoroUsed + 1;
        }
        return task;
      })
      );
    }
  };

  return (
    <>
      <div className={styles.tasksContainer}>
        <Info/>
        <AddTask handleAddTask={handleAddTask}/>
        <SortableList
          tasks={tasks}

          handleCompletedChange={handleCompletedChange}
          handleTaskChange={handleTaskChange}

          handleDeleted={handleDeleted}
          onSortEnd={onSortEnd}
          distance={5}
          onSortStart={onSortStart }


        />
      </div>
      <TimerContainer
        pomodoroDone={pomodoroDone}
        isAnyWork={isAnyWork}
      />
    </>
  );
}
