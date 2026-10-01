/* MAIN MODULE: task actions, event delegation, and application start-up. */

import { SAMPLE_TASKS, EMPTY_MESSAGE } from "./data.js";
import { isBlank, generateTaskId } from "./utils.js";
import {
  elements,
  showMessage,
  clearMessage,
  createTaskElement,
  updateTaskCounts
} from "./display.js";

const { taskInput, addTaskBtn, loadSamplesBtn, taskList } = elements;

function addTask(taskText) {
  if (isBlank(taskText)) {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const taskItem = createTaskElement(taskText.trim(), generateTaskId(taskList));
  taskList.appendChild(taskItem);

  taskInput.value = "";
  clearMessage();
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!textSpan || !editBtn) {
    return;
  }

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;

  textSpan.replaceWith(editInput);
  editBtn.textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!editInput || !editBtn) {
    return;
  }

  if (isBlank(editInput.value)) {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = editInput.value.trim();

  editInput.replaceWith(textSpan);
  editBtn.textContent = "Edit";
  clearMessage();
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function handleTaskListClick(event) {
  const target = event.target;
  if (!target.matches(".complete-btn, .edit-btn, .remove-btn")) {
    return;
  }

  const taskItem = target.closest(".task-item");
  if (!taskItem) {
    return;
  }

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();

  SAMPLE_TASKS.forEach((sampleText) => {
    fragment.appendChild(createTaskElement(sampleText, generateTaskId(taskList)));
  });

  taskList.appendChild(fragment);
  clearMessage();
  updateTaskCounts();
}

taskList.addEventListener("click", handleTaskListClick);
addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});

updateTaskCounts();