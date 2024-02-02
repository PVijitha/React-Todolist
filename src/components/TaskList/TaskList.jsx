import React from 'react';
import './TaskList.css';

function TaskList({task}) {
  return (
    <div className='task-container'>
     <div>{task.title}</div>
     <div>{task.description}</div>
    </div>
  )
}

export default TaskList