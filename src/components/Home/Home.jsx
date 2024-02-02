import React,{useState, useEffect} from "react";
import AddTodo from "../AddTodo/AddTodo";
import "./Home.css";
import TaskList from "../TaskList/TaskList";
import {InputGroup, Button, Form} from 'react-bootstrap';
function Home() {
  
  /*to show/hides the modal */
  const [show, setShow] = useState(false);

  /*original/update task state */
  const [task, setTask] = useState([]);

  /*to perform search */
  const [search, setSearch] = useState("");
  
  const [searchList, setsearchList] = useState([]);
  
  /*to set the todos from local storage to state*/
  useEffect(() => {
    const storedTodos = localStorage.getItem("tasks");
    if (storedTodos) {
      setTask(JSON.parse(storedTodos));
    }
  }, []);

  function addTask (title, description)  {
    const newTask = [...task, { title, description }];
    setTask(newTask);
  }

  function searchItem () {
    const list = task.filter(item => item.title === search);
    setsearchList([...list]);
  }
  return (
      <>
      <div className="container">
        <h1 className="pt-2">My Todo List</h1>
        <div className="d-flex mt-3">
        <InputGroup className="boot-search">
        <Form.Control placeholder="Search . . ." aria-label="Search" aria-describedby="basic-addon2" onChange={(e) => setSearch(e.target.value)}/>
        <Button variant="outline-secondary" id="button-addon2">X</Button></InputGroup>
        <button type="button" className="btn btn-warning ms-2 mb-2" onClick={searchItem}>Search</button>
        <button type="button" className="btn btn-primary ms-3 mb-2" onClick={() => setShow(true)}>Add</button>
        </div>
        <div>
        {search.length > 0 ? (searchList?.map((task, index) => <TaskList key={index} task = {task} />)): task?.map((task, index) => <TaskList key={index} task = {task} />)}
        </div>
        <AddTodo show={show} setShow={setShow} addTask={addTask}/>
      </div>
    </>
  );
}

export default Home;
