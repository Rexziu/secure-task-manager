

export function showMessage(messageElement, message) {
  messageElement.textContent = message;
}

export function clearMessage(messageElement) {
  messageElement.textContent = "";
}

export function renderCounts({ totalEl, pendingEl, completedEl }, counts) {
  const { total, pending, completed } = counts;
  totalEl.textContent = total;
  pendingEl.textContent = pending;
  completedEl.textContent = completed;
}
