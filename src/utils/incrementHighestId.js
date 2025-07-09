export default function incrementHighestId(arr) {
  // map workout template id's to new array and sort it from high to low. Get highest num by [0].
  // Needed when saving the exercise
  let currentHighest = 0;

  if (arr.length > 0) {
    currentHighest = arr
      .map((template) => {
        return template.id;
      })
      .sort((a, b) => {
        return b - a;
      })[0];
  }
  // add 1 to increment to the correct count
  return currentHighest + 1;
}
