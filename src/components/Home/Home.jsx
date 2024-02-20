import React, { useState, useEffect } from "react";
import ManageTasks from "../ManageTasks/ManageTasks";
import "./Home.css";
import TaskList from "../TaskList/TaskList";
import { InputGroup, Button, Form } from "react-bootstrap";
import NotFound from "../NotFound/NotFound";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

function Home() {
  /*to show/hides the modal */
  const [show, setShow] = useState(false);

  /*original/update task state */
  const [task, setTask] = useState([]);

  console.log("task", task)

  /*to perform search */
  const [search, setSearch] = useState("");

  const [newIds, setNewIds] = useState([]);

  const [selectedTodo, setSelectedTodo] = useState({})
  
  const [status, setStatus] = useState("Todo")

  const [count, setCount] = useState(0);

  const [isEditMode, setIsEditMode] = useState(false);
  // Use local storage to retrieve the previous state
  const [isSorted, setIsSorted] = useState(() => {
    const storedState = localStorage.getItem('isSorted');
    return storedState ? JSON.parse(storedState) : false;
  });
 
  /*to set the todos from local storage to state*/
  useEffect(() => {
    getLocalStorageData();
  }, []);

  // Update local storage whenever the state changes
  useEffect(() => {
    localStorage.setItem('isSorted', JSON.stringify(isSorted));
  }, [isSorted]);

  function getLocalStorageData() {
    const storedTodos = localStorage.getItem("tasks");
    if (storedTodos) {
      setTask(() => {
        const parsedTodos = JSON.parse(storedTodos);
        return parsedTodos;
      });
    }
  }

  function handleInputSearchChange(e) {
    setSearch(e.target.value);
    if (e.target.value === "") {
      getLocalStorageData();
    }
  }

  function addTask(title, description, id) {
    const newTask = [...task, { title, description, id, status}];
    setTask(newTask);
  }

  function searchItem() {
    const list = task.filter((item) => item.title.toLowerCase() === search.toLowerCase());
    setTask([...list]);
  }

  function clear() {
    setSearch("");
    getLocalStorageData();
  }

  function handleDeleteAlert() {
    const result = window.confirm("Are you sure you want to delete?");
    return result ? true : false ;
  }

function selectTask(task) {
  if (!newIds.includes(task.id)) {
    setNewIds([...newIds, task.id]);
    setCount(count + 1);
  } else {
    const updatedIds = newIds.filter(existingId => existingId !== task.id);
    setNewIds(updatedIds);
    setCount(count - 1);
  }
}

function deleteTask() {
    if(handleDeleteAlert()){
      const updatedTaskList = task.filter((t) => !newIds.includes(t.id));
      localStorage.setItem("tasks", JSON.stringify(updatedTaskList));
      setNewIds([]);
      getLocalStorageData();
      setCount(0);
    }
    else {
      setCount(0);
    }
}

function selectAllTasks() {
     const allTaskIds = task.map(task => task.id);
     if (newIds.length < allTaskIds.length) {
       setNewIds(allTaskIds);
       setCount(allTaskIds.length);
     } else {
       setNewIds([]);
       setCount(0);
     }
}

  function sortItems() {
    if(isSorted) {
    const strAscending = [...task].sort((a, b) => a.id - b.id);
    localStorage.setItem("tasks", JSON.stringify(strAscending));
    getLocalStorageData();
    }
    else {
    const strDescending = [...task].sort((a, b) => b.id - a.id);
    localStorage.setItem("tasks", JSON.stringify(strDescending));
    getLocalStorageData();
    }
  }

  function sort() {
    setIsSorted(!isSorted);
    sortItems();
  }

  function handleAdd() {
    setShow(true);
    setIsEditMode(false);
  }
  return (
    <>
        <h1 className="pt-2 pb-3 heading">My Todo List</h1>
        <div className="d-flex mt-3">
        <button
            type="button"
            className="btn btn-primary select-all-button mb-2"
            onClick={selectAllTasks}
          >
            Select {count}
          </button>
          <InputGroup className="boot-search ms-3">
            <Form.Control
              placeholder="Search . . ."
              aria-label="Search"
              aria-describedby="basic-addon2"
              value={search}
              onChange={handleInputSearchChange}
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              onClick={clear}
            >
              X
            </Button>
          </InputGroup>
          <button
            type="button"
            className="btn btn-warning ms-3 mb-2"
            onClick={searchItem}
          >
            Search
          </button>
          <button
            type="button"
            className="btn btn-primary ms-3 mb-2"
            onClick={handleAdd}
          >
            Add
          </button>
          <button type="button" className={`sort ms-3 mb-2 ${isSorted? 'down-arrow' : ''}`} onClick={sort}><FontAwesomeIcon icon={faArrowUp} /></button>         
           {count ? (
            <button
              type="button"
              className="btn btn-danger ms-3 mb-2"
              onClick={deleteTask}
            >
              Delete
            </button>
           ) : null}
        </div>
        <div className="list-container">
          {task.length > 0 ? (
            task?.map((task, index) => (
              <TaskList key={index} task={task} selectTask={selectTask} newIds={newIds} setShow={setShow} setIsEditMode={setIsEditMode} setSelectedTodo={setSelectedTodo}/>
            ))
          ) : (
            <NotFound />
          )}
        </div>
        <ManageTasks show={show} setShow={setShow} addTask={addTask} isEditMode={isEditMode} selectedTodo={selectedTodo} setStatus={setStatus} setTask={setTask}/>
    </>
  );
}

export default Home;
