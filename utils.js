
import { TASK_ID_PREFIX, TASK_STATES } from "./data.js";


export function createTaskIdGenerator(prefix = TASK_ID_PREFIX) {
  let counter = 0;
  return () => {
    counter += 1;
    return `${prefix}${counter}`;
  };
}

export function validateTaskText(rawText) {
  const value = String(rawText).trim();
  return { isValid: value.length > 0, value };
}

export function countTasks(taskItems) {
  const pending = taskItems.filter(
    (item) => item.dataset.state === TASK_STATES.pending
  ).length;
  const completed = taskItems.filter(
    (item) => item.dataset.state === TASK_STATES.completed
  ).length;

  return { total: taskItems.length, pending, completed };
}
