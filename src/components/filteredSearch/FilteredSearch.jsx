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
    let filteredExercises = exercises;
    if (searchValue) {
      filteredExercises = filteredExercises.filter((exercise) => {
        return exercise.name.toLowerCase().includes(searchValue.toLowerCase());
      });
    }
    setSearchQuery(filteredExercises);
  }, [exercises, searchValue]);

  // usEffect for click outside of component
  useEffect(() => {
    function handleClick(e) {
      if (
        searchFilterRef.current &&
        !searchFilterRef.current.contains(e.target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    // unmounting phase/return
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    searchValue.length > 0 &&
    searchQuery.length > 1 && (
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
