
export const elements = {
  taskInput: document.getElementById("taskInput"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  loadSamplesBtn: document.getElementById("loadSamplesBtn"),
  taskList: document.getElementById("taskList"),
  taskMessage: document.getElementById("taskMessage"),
  totalCount: document.getElementById("totalCount"),
  pendingCount: document.getElementById("pendingCount"),
  completedCount: document.getElementById("completedCount")
};

export function showMessage(message) {
  elements.taskMessage.textContent = message;
}

export function clearMessage() {
  elements.taskMessage.textContent = "";
}

export function taskIdExists(id) {
  return elements.taskList.querySelector(`[data-task-id="${id}"]`) !== null;
}

function createButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  return button;
}

export function createTextSpan(text) {
  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = text;
  return span;
}

export function createEditInput(currentText) {
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("edit-input");
  input.value = currentText;
  input.setAttribute("aria-label", "Edit task");
  return input;
}

export function createTaskElement(taskText, taskId) {
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

export function updateTaskCounts() {
  const states = Array.from(elements.taskList.querySelectorAll(".task-item"))
    .map((task) => task.dataset.state);

  const [total, pending, completed] = [
    states.length,
    states.filter((state) => state === "pending").length,
    states.filter((state) => state === "completed").length
  ];

  elements.totalCount.textContent = total;
  elements.pendingCount.textContent = pending;
  elements.completedCount.textContent = completed;
}