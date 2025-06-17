export function formatDate() {
  const options = {
    weekday: "short",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("default", options);
}
