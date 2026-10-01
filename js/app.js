
import { EMPTY_TASK_MESSAGE, SAMPLE_TASKS, generateTaskId } from "./data.js";
import { cleanText, isBlank } from "./utils.js";
import {
  elements,
  showMessage,
  clearMessage,
  taskIdExists,
  createTextSpan,
  createEditInput,
  createTaskElement,
  updateTaskCounts
} from "./display.js";

const { taskInput, addTaskBtn, loadSamplesBtn, taskList } = elements;

function addTask(taskText) {
  if (isBlank(taskText)) {
    showMessage(EMPTY_TASK_MESSAGE);
    taskInput.focus();
    return;
  }

  const taskId = generateTaskId(taskIdExists);
  taskList.appendChild(createTaskElement(cleanText(taskText), taskId));
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
  const editInput = createEditInput(textSpan.textContent);

  textSpan.replaceWith(editInput);
  taskItem.querySelector(".edit-btn").textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");

  if (isBlank(editInput.value)) {
    showMessage(EMPTY_TASK_MESSAGE);
    editInput.focus();
    return;
  }

  editInput.replaceWith(createTextSpan(cleanText(editInput.value)));
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  clearMessage();
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function handleTaskListClick(event) {
  const clicked = event.target;
  const taskItem = clicked.closest(".task-item");

  if (!taskItem || !taskList.contains(taskItem)) {
    return;
  }

  if (clicked.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (clicked.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (clicked.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();

  SAMPLE_TASKS.forEach((sampleText) => {
    fragment.appendChild(createTaskElement(sampleText, generateTaskId(taskIdExists)));
  });

  taskList.appendChild(fragment);
  clearMessage();
  updateTaskCounts();
}

addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskList.addEventListener("click", handleTaskListClick);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});

taskList.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches(".edit-input")) {
    saveTaskEdit(event.target.closest(".task-item"));
  }
});

Object.assign(window, {
  createTaskElement,
  addTask,
  toggleTaskComplete,
  beginTaskEdit,
  saveTaskEdit,
  removeTask,
  updateTaskCounts,
  handleTaskListClick,
  loadSampleTasks
});

updateTaskCounts();