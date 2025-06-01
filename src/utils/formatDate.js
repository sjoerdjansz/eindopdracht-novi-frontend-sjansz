export function formatDate() {
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("nl-NL", options);
}
