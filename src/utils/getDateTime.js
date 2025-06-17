export function getDateTime(start, end) {
  const startHours = new Date(start).getHours().toString().padStart(2, "0");
  const startMinutes = new Date(start).getMinutes().toString().padStart(2, "0");

  const endHours = new Date(end).getHours().toString().padStart(2, "0");
  const endMinutes = new Date(end).getMinutes().toString().padStart(2, "0");

  const date = new Date(start).toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  return {
    start: `${startHours}:${startMinutes}`,
    end: `${endHours}:${endMinutes}`,
    date: date,
  };
}

export function getDay(day) {
  return new Date(day).toLocaleString("default", {
    month: "long",
    day: "numeric",
  });
}
