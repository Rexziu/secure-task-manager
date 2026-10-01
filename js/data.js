
export const EMPTY_TASK_MESSAGE = "Task cannot be empty";

export const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

let taskCounter = 0;

export function generateTaskId(isTaken) {
  let id;
  do {
    taskCounter += 1;
    id = `task-${taskCounter}`;
  } while (isTaken(id));
  return id;
}