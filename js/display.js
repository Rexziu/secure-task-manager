
import { createButton } from "./utils.js";

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

export function createTaskElement(taskText, taskId) {
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

export function updateTaskCounts() {
  const { taskList, totalCount, pendingCount, completedCount } = elements;
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