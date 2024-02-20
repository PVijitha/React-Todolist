import React, { useState, useEffect } from "react";
import ManageTasksModal from "../ManageTasks/ManageTasksModal";
import "./Home.css";
import TaskList from "../TaskList/TaskList";
import { InputGroup, Button, Form } from "react-bootstrap";
import NotFound from "../NotFound/NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import TodoStatus from "../TodoStatus/TodoStatus";

export default function Home() {
  /*to show/hides the modal */
  const [show, setShow] = useState(false);

  /*original/update task state */
  const [task, setTask] = useState([]);

  /*to perform search */
  const [search, setSearch] = useState("");

  const [selectedTodo, setSelectedTodo] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [isTitleValid, setIsTitleValid] = useState(true);

  const [isAlreadyExist, setisAlreadyExist] = useState(true);

  const [selectedItem, setSelectedItem] = useState("");
  // Use local storage to retrieve the previous state
  const [isSorted, setIsSorted] = useState(() => {
    const storedState = localStorage.getItem("isSorted");
    return storedState ? JSON.parse(storedState) : false;
  });

  /*to set the todos from local storage to state*/
  useEffect(() => {
    getLocalStorageData();
  }, []);

  // Update local storage whenever the state changes
  useEffect(() => {
    localStorage.setItem("isSorted", JSON.stringify(isSorted));
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

  function addTask(title, description, id, status) {
    const newTask = [...task, { title, description, id, status }];
    setTask(newTask);
  }

  function searchItem() {
    const list = task.filter(
      item => item.title.toLowerCase() === search.toLowerCase(),
    );
    setTask([...list]);
  }

  function clear() {
    setSearch("");
    getLocalStorageData();
  }

  function handleDeleteAlert() {
    const result = window.confirm("Are you sure you want to delete?");
    return result ? true : false;
  }

  function selectTask(task) {
    const taskIndex = selectedTodo.findIndex(
      selectedTask => selectedTask.id === task.id,
    );
    // Task not found in selectedTodo, add it
    if (taskIndex === -1) {
      setSelectedTodo([...selectedTodo, task]);
    }
    // Task found in selectedTodo, remove it
    else {
      const updatedTasks = [...selectedTodo];
      updatedTasks.splice(taskIndex, 1);
      setSelectedTodo([...updatedTasks]);
    }
  }

  function deleteTask(singleTask) {
    const showAlert = handleDeleteAlert();
    if (!showAlert) {
      setSelectedTodo([]);
      return;
    }
    if (showAlert) {
      let updatedTaskList = [];
      if (!singleTask) {
        updatedTaskList = task.filter(
          task =>
            !selectedTodo.some(selectedTask => selectedTask.id === task.id),
        );
      } else {
        updatedTaskList = task.filter(task => singleTask.id !== task.id);
      }
      localStorage.setItem("tasks", JSON.stringify(updatedTaskList));
      setSelectedTodo([]);
      getLocalStorageData();
    }
  }

  function selectAllTasks() {
    if (!selectedTodo.length) {
      setSelectedTodo(task);
    } else {
      setSelectedTodo([]);
    }
  }

  function sortItems() {
    if (isSorted) {
      const strAscending = [...task].sort((a, b) => a.id - b.id);
      localStorage.setItem("tasks", JSON.stringify(strAscending));
      getLocalStorageData();
    } else {
      const strDescending = [...task].sort((a, b) => b.id - a.id);
      localStorage.setItem("tasks", JSON.stringify(strDescending));
      getLocalStorageData();
    }
  }

  function sort() {
    setIsSorted(!isSorted);
    sortItems();
  }

  const addItem = () => {
    setSelectedTodo([]);
    const trimmedTitle = title.trim();
    if (trimmedTitle === "") {
      setIsTitleValid(false);
      return;
    }
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const titleAlreadyExists = existingTasks?.some(
      task => task.title.toLowerCase() === trimmedTitle.toLowerCase(),
    );
    if (titleAlreadyExists) {
      setisAlreadyExist(false);
      return;
    }
    const maxId = existingTasks.reduce(
      (max, task) => (task.id > max ? task.id : max),
      0,
    );
    const newId = maxId + 1;
    const updatedTasks = [
      ...existingTasks,
      {
        title: trimmedTitle,
        description,
        id: newId,
        status: TodoStatus.TODO,
      },
    ];
    addTask(trimmedTitle, description, newId, TodoStatus.TODO);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTitle("");
    setDescription("");
    setIsTitleValid(true);
    setisAlreadyExist(true);
    setShow(false);
  };

  function handleEditItem() {
    const editTask = selectedTodo[0];
    console.log(selectedTodo, "editTask");
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const indexOfSelectedTodo = existingTasks.findIndex(
    task => task.id === editTask.id);
    const updatedTask = {
      id: editTask.id,
      title: editTask.title,
      description: description,
      status: selectedItem,
    };
    const updatedTasks = [
      ...existingTasks.slice(0, indexOfSelectedTodo),
      updatedTask,
      ...existingTasks.slice(indexOfSelectedTodo + 1),
    ];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTask(updatedTasks);
    setDescription("");
    setSelectedTodo([]);
    setShow(false);
  }

  function handleClose() {
    setIsTitleValid(true);
    setisAlreadyExist(true);
    setShow(false);
    setTitle("");
    setDescription("");
    setSelectedTodo([]);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
    if (!isEditMode) {
      setIsTitleValid(true);
      setisAlreadyExist(true);
    }
  }

  function handleAdd() {
    setShow(true);
    setIsEditMode(false);
  }

  return (
    <>
      <h1 className="pt-2 pb-3 heading">My Todo List</h1>
      <div className="d-flex mt-3">
        <input
          className="form-check-input checkbox-home"
          type="checkbox"
          checked={selectedTodo.length === task.length}
          onChange={selectAllTasks}
        />
        <button
          type="button"
          className="btn btn-primary select-all-button mb-2"
        >
          Select ({selectedTodo.length})
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
        <button
          type="button"
          className={`sort ms-3 mb-2 ${isSorted ? "down-arrow" : ""}`}
          onClick={sort}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        {selectedTodo.length > 1 ? (
          <button
            type="button"
            className="btn btn-danger ms-3 mb-2"
            onClick={() => {
              deleteTask(null);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        ) : null}
      </div>
      <div className="list-container">
        {task.length > 0 ? (
          task?.map((task, index) => (
            <TaskList
              key={index}
              task={task}
              selectTask={selectTask}
              setShow={setShow}
              setIsEditMode={setIsEditMode}
              setSelectedTodo={setSelectedTodo}
              selectedTodo={selectedTodo}
              deleteTask={deleteTask}
              setSelectedItem={setSelectedItem}
              setDescription={setDescription}
            />
          ))
        ) : (
          <NotFound />
        )}
      </div>
      { show ? 
        <ManageTasksModal
        show={show}
        isEditMode={isEditMode}
        handleClose={handleClose}
        handleTitleChange={handleTitleChange}
        handleDescriptionChange={handleDescriptionChange}
        addItem={addItem}
        isTitleValid={isTitleValid}
        isAlreadyExist={isAlreadyExist}
        handleEditItem={handleEditItem}
        setSelectedItem={setSelectedItem}
        task={task}
        selectedTodo={selectedTodo}
        selectedItem={selectedItem}
      />: null}
    </>
  );
}
