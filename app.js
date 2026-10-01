
import { MESSAGES, SAMPLE_TASKS, TASK_STATES } from "./data.js";
import { createTaskIdGenerator, validateTaskText, countTasks } from "./utils.js";
import { showMessage, clearMessage, renderCounts } from "./display.js";


const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const countElements = {
  totalEl: document.getElementById("totalCount"),
  pendingEl: document.getElementById("pendingCount"),
  completedEl: document.getElementById("completedCount")
};

const generateTaskId = createTaskIdGenerator();


function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = TASK_STATES.pending;

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.classList.add("complete-btn");
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "Remove";

  taskItem.append(textSpan, completeBtn, editBtn, removeBtn);
  return taskItem;
}

function addTask(taskText) {
  const { isValid, value } = validateTaskText(taskText);

  if (!isValid) {
    showMessage(taskMessage, MESSAGES.emptyTask);
    return;
  }

  const taskItem = createTaskElement(value, generateTaskId());
  taskList.appendChild(taskItem);

  taskInput.value = "";
  clearMessage(taskMessage);
  updateTaskCounts();
}


function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted
    ? TASK_STATES.completed
    : TASK_STATES.pending;
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

  const { isValid, value } = validateTaskText(editInput.value);

  if (!isValid) {
    showMessage(taskMessage, MESSAGES.emptyTask);
    return;
  }

  const newSpan = document.createElement("span");
  newSpan.classList.add("task-text");
  newSpan.textContent = value;

  editInput.replaceWith(newSpan);
  editBtn.textContent = "Edit";
  clearMessage(taskMessage);
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const taskItems = Array.from(taskList.querySelectorAll(".task-item"));
  renderCounts(countElements, countTasks(taskItems));
}

function handleTaskListClick(event) {
  const button = event.target;
  const taskItem = button.closest(".task-item");

  if (!taskItem) {
    return;
  }

  if (button.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (button.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (button.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();

  SAMPLE_TASKS.forEach(({ text }) => {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });

  taskList.appendChild(fragment);
  clearMessage(taskMessage);
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
