
import { taskState } from "./data.js";

export function isBlank(text) {
  return text.trim() === "";
}

export function generateTaskId(taskList) {
  let id;
  do {
    taskState.taskCounter += 1;
    id = `task-${taskState.taskCounter}`;
  } while (taskList.querySelector(`[data-task-id="${id}"]`));
  return id;
}

export function createButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(className);
  button.textContent = label;
  return button;
}