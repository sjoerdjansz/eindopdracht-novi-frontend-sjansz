export function colorCodeText(grade) {
  if (grade >= 80) {
    return "high";
  } else if (grade >= 55) {
    return "medium";
  } else {
    return "low";
  }
}
