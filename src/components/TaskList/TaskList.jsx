import React from 'react';
import './TaskList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import TodoStatusEnum from '../Enum/TodoStatus';

function TaskList({ task, selectTask, newIds, setShow, setIsEditMode, setSelectedTodo}) {

  function handleClick() {
    selectTask(task);
  }

  function handileEdit() {
    setShow(true);
    setIsEditMode(true);
  }
  return (
    <>
      <div className={`task-container ${newIds.includes(task.id) ? 'clicked' : ''}`}>
         <input className="form-check-input checkbox ms-1" type="checkbox" checked={newIds.includes(task.id)} onClick={handleClick}/>
          <div className='fs-5 title ms-5'><b>{task.title}</b></div>
          <div className='ms-5'>{task.description}</div>
          <div className={`status ${task.status === TodoStatusEnum.TODO ? 'text-dark' :
           task.status === 'In progress' ? 'text-info' :
           task.status === TodoStatusEnum.COMPLETED ? 'text-success' : 'text-danger'}`}><b>{task.status}</b></div>
          <button onClick={() => {handileEdit(); setSelectedTodo(task)}} className='edit-icon'><FontAwesomeIcon icon={faEdit} /></button>
        </div>
    </>
  );
}

export default TaskList;
