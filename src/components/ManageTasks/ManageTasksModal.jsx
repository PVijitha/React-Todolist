import React from "react";
import { Modal, Button, Dropdown, DropdownButton } from "react-bootstrap";
import "./ManageTasksModal.css";
import TodoStatusEnum from "../TodoStatus/TodoStatus";

function ManageTasksModal({
  show,
  isEditMode,
  handleEditItem,
  addItem,
  isTitleValid,
  isAlreadyExist,
  selectedItem,
  handleClose,
  handleTitleChange,
  handleDescriptionChange,
  task,
  selectedTodo,
  handleSelect
}) {

  return (
    <div>
      <Modal show={show} onHide={handleClose} className="modal-container">
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Task" : "New Task"}</Modal.Title>
        </Modal.Header>
        <input
          type="text"
          placeholder={isEditMode ? "" : "Title"}
          defaultValue={isEditMode ? selectedTodo[0].title : ""}
          className="ms-1 mb-1 p-2 task-title"
          onChange={isEditMode ? null : handleTitleChange}
          disabled={isEditMode}
          required={!isEditMode}
        />
        {!isTitleValid && <p className="error ms-1">Title cannot be empty</p>}
        {!isAlreadyExist && (
          <p className="error ms-1">This task already exist in todolist</p>
        )}
        <textarea
          name="textarea"
          id="textarea"
          defaultValue={isEditMode ? selectedTodo[0].description : ""}
          placeholder="Add task description...."
          className="area ms-1 ps-2"
          onChange={handleDescriptionChange}
        />
        <Modal.Footer>
          {isEditMode ? (
            <DropdownButton
              id="dropdown-basic-button"
              title={selectedItem}
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="Todo">
                {TodoStatusEnum.TODO}
              </Dropdown.Item>
              <Dropdown.Item eventKey="In progress">
                {TodoStatusEnum.INPROGRESS}
              </Dropdown.Item>
              <Dropdown.Item eventKey="Completed">
                {TodoStatusEnum.COMPLETED}
              </Dropdown.Item>
              <Dropdown.Item eventKey="Cancel">
                {TodoStatusEnum.CANCEL}
              </Dropdown.Item>
            </DropdownButton>
          ) : null}
          <Button
            variant="primary"
            onClick={
              isEditMode
                ? () => {
                    handleEditItem(task);
                  }
                : addItem
            }
            disabled={!isTitleValid}
          >
            {isEditMode ? "Update Changes" : "Add"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageTasksModal;
