
const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

const EMPTY_MESSAGE = "Task cannot be empty";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskCounter = 0;

function generateTaskId() {
  let id;
  do {
    taskCounter += 1;
    id = `task-${taskCounter}`;
  } while (taskList.querySelector(`[data-task-id="${id}"]`));
  return id;
}

function isBlank(text) {
  return text.trim() === "";
}

function showMessage(message) {
  taskMessage.textContent = message;
}

function clearMessage() {
  taskMessage.textContent = "";
}

function createButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(className);
  button.textContent = label;
  return button;
}

function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  const completeBtn = createButton("complete-btn", "Complete");
  const editBtn = createButton("edit-btn", "Edit");
  const removeBtn = createButton("remove-btn", "Remove");

  taskItem.append(textSpan, completeBtn, editBtn, removeBtn);
  return taskItem;
}

function updateTaskCounts() {
  const tasks = Array.from(taskList.querySelectorAll(".task-item"));
  const counts = {
    total: tasks.length,
    pending: tasks.filter((task) => task.dataset.state === "pending").length,
    completed: tasks.filter((task) => task.dataset.state === "completed").length
  };

  const { total, pending, completed } = counts;
  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

function addTask(taskText) {
  if (isBlank(taskText)) {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const taskItem = createTaskElement(taskText.trim(), generateTaskId());
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
    const taskItem = createTaskElement(sampleText, generateTaskId());
    fragment.appendChild(taskItem);
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