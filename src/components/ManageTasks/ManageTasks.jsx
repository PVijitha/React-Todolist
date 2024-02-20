import React, { useEffect, useState } from 'react';
import {Modal, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import './ManageTasks.css';
import TodoStatusEnum from "../Enum/TodoStatus";

function ManageTasks({ show, setShow, addTask, isEditMode, selectedTodo, setTask}) {
  console.log(isEditMode);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isAlreadyExist, setisAlreadyExist] = useState(true);
  const [selectedItem, setSelectedItem] = useState('Todo');

  useEffect(() => {
    setDescription(selectedTodo.description);   
      setSelectedItem(selectedTodo.status)
  }, [selectedTodo.description, selectedTodo.status]);

  function handleClose() {
    setIsTitleValid(true);
    setisAlreadyExist(true);
    setShow(false); 
    setTitle("");
    setDescription("");
  } 
  
  const addItem = () => {
    const trimmedTitle = title.trim();    
    if (trimmedTitle === '') {
      setIsTitleValid(false);
      return;
    }
    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const titleAlreadyExists = existingTasks?.some(task => task.title.toLowerCase() === trimmedTitle.toLowerCase()); 
    if (titleAlreadyExists) {
      setisAlreadyExist(false);
      return;
    } 
    const maxId = existingTasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
    const newId = maxId + 1;
    const updatedTasks = [...existingTasks, { title: trimmedTitle, description, id: newId, status: TodoStatusEnum.TODO}];
    addTask(trimmedTitle, description, newId, );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTitle("");
    setDescription("");
    setIsTitleValid(true);
    setisAlreadyExist(true);
    setShow(false);
  };

  function handleTitleChange(e) {
    setTitle(e.target.value);
    if(!isEditMode) {
    setIsTitleValid(true); 
    setisAlreadyExist(true); 
    }
  }

  function handleDescriptionChange(e) {
    console.log(e);
    setDescription(e.target.value);
  }

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  function handleEditItem() {      
      const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const indexOfSelectedTodo = existingTasks.findIndex(task => task.id === selectedTodo.id);
      const updatedTask = {
        ...selectedTodo,
        description: description,
        status: selectedItem
      };
      const updatedTasks = [...existingTasks.slice(0, indexOfSelectedTodo), updatedTask, ...existingTasks.slice(indexOfSelectedTodo + 1)];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTask(updatedTasks);
      setDescription("");
      setShow(false);
    };
    
  return (
    <div>
      <Modal show={show} onHide={handleClose} className='modal-container'>
      <Modal.Header closeButton>
      <Modal.Title>{isEditMode ? 'Edit Task' : 'New Task'}</Modal.Title>
      </Modal.Header>
      {isEditMode ? 
        <input type="text" value={selectedTodo.title} className='ms-1 mb-1 p-2 task-title' disabled/> : 
        <input type="text" placeholder='Title' className='ms-1 mb-1 p-2 task-title'  value={title} onChange={handleTitleChange} required/>
      }
        {!isTitleValid &&<p className='error ms-1'>Title cannot be empty</p>}
        {!isAlreadyExist  &&<p className='error ms-1'>This task already exist in todolist</p>}
      <textarea name="textarea" id="textarea" value={description} placeholder='Add task description....' className='area ms-1 ps-2' onChange={handleDescriptionChange}/>
      <Modal.Footer>
      {isEditMode ? (<DropdownButton id="dropdown-basic-button" title={selectedItem} onSelect={handleSelect}>
      <Dropdown.Item eventKey="Todo">{TodoStatusEnum.TODO}</Dropdown.Item>
      <Dropdown.Item eventKey="In progress">{TodoStatusEnum.INPROGRESS}</Dropdown.Item>
      <Dropdown.Item eventKey="Completed">{TodoStatusEnum.COMPLETED}</Dropdown.Item>
      <Dropdown.Item eventKey="Cancel">{TodoStatusEnum.CANCEL}</Dropdown.Item>
      </DropdownButton>): null }
      <Button variant="primary" onClick={isEditMode ? () => {handleEditItem();} : addItem} disabled={!isTitleValid}>{isEditMode ? 'Update Changes' : 'Add'}</Button>
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      </Modal.Footer>
      </Modal></div>
  )
}

export default ManageTasks
