
export function cleanText(value) {
  return value.trim();
}

export function isBlank(value) {
  return cleanText(value) === "";
}