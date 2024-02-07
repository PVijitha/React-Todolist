import React, { useState, useEffect } from "react";
import AddTodo from "../AddTodo/AddTodo";
import "./Home.css";
import TaskList from "../TaskList/TaskList";
import { InputGroup, Button, Form } from "react-bootstrap";
import NotFound from "../NotFound/NotFound";
function Home() {
  /*to show/hides the modal */
  const [show, setShow] = useState(false);

  /*original/update task state */
  const [task, setTask] = useState([]);

  /*to perform search */
  const [search, setSearch] = useState("");

  const [selectAll, setSelectAll] = useState(false);

  const [itemToDelete, setItemToDelete] = useState("");

  const [sortItem, setSortItem] = useState(false);
  /*to set the todos from local storage to state*/
  useEffect(() => {
    getLocalStorageData();
  }, []);

  function getLocalStorageData() {
    const storedTodos = localStorage.getItem("tasks");
    if (storedTodos) {
      setTask(() => {
        const parsedTodos = JSON.parse(storedTodos);
        return parsedTodos;
      });
    }
  }

  function handleInputChange(e) {
    setSearch(e.target.value);
    if (e.target.value === "") {
      getLocalStorageData();
    }
  }
  function addTask(title, description) {
    const newTask = [...task, { title, description }];
    setTask(newTask);
  }

  function searchItem() {
    const list = task.filter(
      (item) => item.title.toLowerCase() === search.toLowerCase()
    );
    setTask([...list]);
  }
  function clear() {
    setSearch("");
    getLocalStorageData();
  }

  function SelectAll() {
    setSelectAll(!selectAll);
    console.log("selectclicked");
    console.log(!selectAll);

  }

  function handleAllDeleteButtonClick() {
    const result = window.confirm("Are you sure you want to delete All task?");
    return result ? true : false ;
    // if (result) {
    //   setSelectAll(true);
    //   console.log(setSelectAll(true));
    // } else {
    //   setSelectAll(false);
    //   console.log(!selectAll);
    // }
  }

  function handleOneDeleteButtonClick() {
    const result = window.confirm("Are you sure you want to delete?");
    return result ? true : false ;
  }

  function selectOneTask(title) {
    if(itemToDelete.length) {
       setItemToDelete("");
    }
    else {
      setItemToDelete(title);
    }
  }

  function Delete() {
    if (selectAll) {
       if(handleAllDeleteButtonClick()) {
        const DeleteAllTask = [];
        localStorage.setItem("tasks", JSON.stringify(DeleteAllTask));
        getLocalStorageData();
        setSelectAll(false);
        console.log(setSelectAll(!selectAll));
       }
    } else {
      if(handleOneDeleteButtonClick()) {
      const updatedTasks = task.filter((t) => t.title !== itemToDelete);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      getLocalStorageData();
      setItemToDelete("");
      }
    }
  }
  
  function sortItems() {
    if(sortItem) {
      const strAscending = [...task].sort((a, b) =>
      a.title > b.title ? 1 : -1,
    );
    localStorage.setItem("tasks", JSON.stringify(strAscending));
    getLocalStorageData();
    }
    else {
      const strDescending = [...task].sort((a, b) =>
      a.title > b.title ? -1 : 1,
    );
    localStorage.setItem("tasks", JSON.stringify(strDescending));
    getLocalStorageData();
    }
  }

  function sort() {
    setSortItem(!sortItem);
    sortItems();
  }
  return (
    <>
        <h1 className="pt-2 pb-3">My Todo List</h1>
        <div className="d-flex mt-3">
          <InputGroup className="boot-search">
            <Form.Control
              placeholder="Search . . ."
              aria-label="Search"
              aria-describedby="basic-addon2"
              value={search}
              onChange={handleInputChange}
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
            onClick={() => setShow(true)}
          >
            Add
          </button>
          <button
            type="button"
            className="btn btn-primary ms-3 mb-2"
            onClick={SelectAll}
          >
            Select All
          </button>
          <button type="button" className="btn btn-primary ms-3 mb-2" onClick={sort}>Sort</button>
          {selectAll || itemToDelete.length ? (
            <button
              type="button"
              className="btn btn-danger ms-3 mb-2"
              onClick={Delete}
            >
              Delete
            </button>
          ) : null}
        </div>
        <div className="list-container">
          {task.length > 0 ? (
            task?.map((task, index) => (
              <TaskList key={index} task={task} handleDelete={selectOneTask} selectAll={selectAll}/>
            ))
          ) : (
            <NotFound />
          )}
        </div>
        <AddTodo show={show} setShow={setShow} addTask={addTask} />
    </>
  );
}

export default Home;
