import styles from "./FilteredSearch.module.css";
import { useEffect, useRef, useState } from "react";
export function FilteredSearch({
  exercises,
  searchValue,
  handleSelectExercise,
  onClose,
}) {
  const [searchQuery, setSearchQuery] = useState([]);

  const searchFilterRef = useRef(null);

  // filtering logic
  useEffect(() => {
    // create copy of exercises so we can use it to search and add it to the state
    let filteredExercises = exercises;
    if (searchValue) {
      filteredExercises = filteredExercises.filter((exercise) => {
        return exercise.name.toLowerCase().includes(searchValue.toLowerCase());
      });
    }
    setSearchQuery(filteredExercises);
  }, [exercises, searchValue]); // update on exercises or searchValue change

  // usEffect for click outside of component
  useEffect(() => {
    function handleClick(e) {
      // TODO: understand refs better
      if (
        searchFilterRef.current && // check if the reference is true (this is the DOM node of filtered search). .current is filled with the DOM node.
        !searchFilterRef.current.contains(e.target) // and if the click didn't happen in the DOM node
      ) {
        onClose(); // then we call onClose - which closes the search filter
      }
    }
    document.addEventListener("mousedown", handleClick); // listen for mousedown event and call the handleClick function.

    // unmounting phase/return
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    searchValue.length > 0 &&
    searchQuery.length > 0 && (
      <div className={styles["filtered-search"]} ref={searchFilterRef}>
        <ul className={styles["filtered-search__dropdown"]}>
          {searchQuery &&
            searchValue.length > 0 &&
            searchQuery.map((exercise) => {
              return (
                <li
                  className={styles["filtered-search__list-item"]}
                  key={exercise.id}
                  id={exercise.id}
                  onClick={() => handleSelectExercise(exercise)}
                >
                  {exercise.name}
                </li>
              );
            })}
        </ul>
      </div>
    )
  );
}
