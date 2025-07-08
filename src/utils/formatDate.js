export function formatDate(dateStr) {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateStr).toLocaleDateString("default", options);
}
