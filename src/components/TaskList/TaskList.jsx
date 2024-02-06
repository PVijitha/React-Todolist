import React, { useState } from 'react';
import './TaskList.css';

function TaskList({ task, handleDelete, selectAll}) {
  const [isClicked, setIsClicked] = useState(false);

  function handleClick() {
    setIsClicked(!isClicked);
    handleDelete(task.title);
  }
  return (
    <>
      <div className='d-flex'>
        <div className={`task-container ${isClicked || selectAll ? 'clicked' : ''}`} onClick={handleClick}>
          <div className='fs-5'><b>{task.title}</b></div>
          <div>{task.description}</div>
        </div>
      </div>
    </>
  );
}

export default TaskList;

