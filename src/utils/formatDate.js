export function formatDate() {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date().toLocaleDateString("default", options);
}
