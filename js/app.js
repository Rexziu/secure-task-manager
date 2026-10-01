"use strict";

const EMPTY_TASK_MESSAGE = "Task cannot be empty";

const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

let taskCounter = 0;

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");


function getCleanText(value) {
  return value.trim();
}

function showMessage(message) {
  taskMessage.textContent = message;
}

function clearMessage() {
  taskMessage.textContent = "";
}

function generateTaskId() {
  let id;
  do {
    taskCounter += 1;
    id = `task-${taskCounter}`;
  } while (taskList.querySelector(`[data-task-id="${id}"]`));
  return id;
}


function createButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  return button;
}

function createTextSpan(text) {
  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = text;
  return span;
}

function createEditInput(currentText) {
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("edit-input");
  input.value = currentText;
  input.setAttribute("aria-label", "Edit task");
  return input;
}

function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  taskItem.append(
    createTextSpan(taskText),
    createButton("complete-btn", "Complete"),
    createButton("edit-btn", "Edit"),
    createButton("remove-btn", "Remove")
  );

  return taskItem;
}

function updateTaskCounts() {
  const tasks = Array.from(taskList.querySelectorAll(".task-item"));
  const countByState = (state) =>
    tasks.filter((task) => task.dataset.state === state).length;

  const counts = {
    total: tasks.length,
    pending: countByState("pending"),
    completed: countByState("completed")
  };

  const { total, pending, completed } = counts;
  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}


function addTask(taskText) {
  const cleanText = getCleanText(taskText);

  if (cleanText === "") {
    showMessage(EMPTY_TASK_MESSAGE);
    return;
  }

  taskList.appendChild(createTaskElement(cleanText, generateTaskId()));
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
  const cleanText = getCleanText(editInput.value);

  if (cleanText === "") {
    showMessage(EMPTY_TASK_MESSAGE);
    return;
  }

  editInput.replaceWith(createTextSpan(cleanText));
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
    fragment.appendChild(createTaskElement(sampleText, generateTaskId()));
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

updateTaskCounts();