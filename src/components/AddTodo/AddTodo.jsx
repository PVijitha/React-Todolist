import React, { useState } from 'react';
import {Modal, Button} from 'react-bootstrap';
import './AddTodo.css';

function AddTodo({ show, setShow, addTask }) {

 function handleClose() {
    setShow(false); 
  } 

  const [title, setValue] = useState("");
  const [description, setDes] = useState("");
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isAlreadyExist, setisAlreadyExist] = useState(true);

  const addItem = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle === '') {
      setIsTitleValid(false);
      return;
    }
    // Check if the title already exists in the tasks
    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const titleAlreadyExists = existingTasks?.some(task => task.title.toLowerCase() === trimmedTitle.toLowerCase()); 
    if (titleAlreadyExists) {
      // Handle the case where the title already exists
      setisAlreadyExist(false);
      return;
    } 
    addTask(trimmedTitle, description);
    const updatedTasks = [...existingTasks, { title: trimmedTitle, description }];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setValue("");
    setDes("");
    setIsTitleValid(true);
    setShow(false);
  };
  
  function handleInputChange(e) {
    setValue(e.target.value);
    setIsTitleValid(true);  
  }

  return (
    <div>
      <Modal show={show} onHide={handleClose} className='modal-container'>
      <Modal.Header closeButton>
      <Modal.Title>New Task</Modal.Title>
      </Modal.Header>
      <input type="text" placeholder='title' className='ms-1 mb-1 p-2 task-title' value={title} onChange={handleInputChange} required/>
        {!isTitleValid &&<p className='error ms-1'>Title cannot be empty</p>}
        {!isAlreadyExist  &&<p className='error ms-1'>This task already exist in todolist</p>}
      <textarea name="textarea" id="textarea" value={description} placeholder='add task description....' className='area ms-1 ps-2' onChange={(e) => setDes(e.target.value)}/>
      <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      <Button variant="primary" onClick={addItem} disabled={!isTitleValid}>Save</Button>
      </Modal.Footer>
      </Modal></div>
  )
}

export default AddTodo