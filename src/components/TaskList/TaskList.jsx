import React from "react";
import "./TaskList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import TodoStatus from "../TodoStatus/TodoStatus";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function TaskList({
  task,
  selectTask,
  setShow,
  setIsEditMode,
  setSelectedTodo,
  selectedTodo,
  deleteTask,
  setSelectedItem,
  setDescription,
}) {
  //handle select task
  function handleClick() {
    selectTask(task);
  }

  //handle edit button
  function handleEdit() {
    setShow(true);
    setIsEditMode(true);
    setSelectedTodo([task]);
    setSelectedItem(task.status);
    setDescription(task.description);
  }

  return (
    <>
      <div
        className={`task-container ${
          selectedTodo.some(selectedTask => selectedTask.id === task.id)
            ? "clicked"
            : ""
        }`}
      >
        <input
          type="checkbox"
          class="rounded-checkbox"
          id="checkbox"
          checked={selectedTodo.some(
            selectedTask => selectedTask.id === task.id,
          )}
          onChange={handleClick}
        />
        <div className="fs-5 ms-5">
          <b>{task.title}</b>
        </div>
        <div className="ms-5">{task.description}</div>
        <div
          className={`status ${
            task.status === TodoStatus.TODO
              ? "text-dark"
              : task.status === "In progress"
              ? "text-info"
              : task.status === TodoStatus.COMPLETED
              ? "text-success"
              : "text-danger"
          }`}
        >
          <b>{task.status}</b>
        </div>
        <button
          onClick={() => {
            handleEdit();
          }}
          className="edit-icon"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          type="button"
          className="delete"
          onClick={() => {
            setSelectedTodo([task]);
            deleteTask(task);
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </>
  );
}

export default TaskList;
