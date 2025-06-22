import styles from "./WorkoutBuilder.module.css";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Button } from "../../components/button/Button.jsx";

import { useState } from "react";

// Components
import { TableRow } from "../../components/tableRow/TableRow.jsx";

// Data
import { EXERCISES } from "../../data/exerciseData.js";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";

export function WorkoutBuilder() {
  const [exercises, setExercises] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [workoutNameInput, setWorkoutNameInput] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  function handleSearchChange(e) {
    setSearchValue(e.target.value);
  }

  function handleWorkoutNameChange(e) {
    setWorkoutNameInput(e.target.value);
  }

  function handleWorkoutSave() {
    setWorkoutName(workoutNameInput);
    setWorkoutNameInput("");
  }

  function handleExerciseSearch(data) {
    const searchQuery = searchValue.toLowerCase().trim();
    setShowSnackbar(false);

    const result = data.find((exercise) => {
      return exercise.name.toLowerCase() === searchQuery;
    });

    if (result) {
      if (exercises.some((exercise) => exercise.id === result.id)) {
        console.log(
          `Exercise --[${result.name}]-- is already in schedule. No duplicates allowed.`,
        );
        setSnackbarMessage("Exercise is already in workout");
        setShowSnackbar(true);
        return; // Stop hier, voeg niets toe
      }

      // Voeg toe als het GEEN duplicaat is
      setExercises((previous) => [
        ...previous,
        {
          id: result.id,
          name: result.name,
          sets: result.sets,
          reps: result.reps,
          rest: result.rest,
        },
      ]);
      setSearchValue("");
    } else {
      console.log("Exercise not found");
      setSnackbarMessage("Exercise not found");
      setShowSnackbar(true);
      setSearchValue("");
    }
  }

  // de start van de drag - item wordt opgepakt
  function handleDragStart(e, exerciseId) {
    e.dataTransfer.setData("text/plain", exerciseId);
    e.dataTransfer.effectAllowed = "move";

    //pakt met de closest property het dichtsbijzinde html element
    const row = e.target.closest("tr");
    // als waar dan voert hij de volgende berekeningen uit:
    if (row) {
      //ingebouwde method die een vierkantje om het geselecteerde element maakt
      const rect = row.getBoundingClientRect();
      // bepaalde op basis van het event de coordinaten op de X en Y as van de muis
      // haalt daar de rechter en linker spacing/coordinaten van de bounding box af om het geselecteerde
      // element direct onder de cursor te krijgen
      const offsetX = e.clientX - rect.left; // horizontaal
      const offsetY = e.clientY - rect.top; // verticaal
      // met de ingebouwde methode een drag image meegeven (img of bij html elementen, whatever je wil),
      // die krijgt de coordinaten en het element mee
      e.dataTransfer.setDragImage(row, offsetX, offsetY);
    }
    // console.log(e);
  }

  // 1. Render de exercises op random volgorde op de pagina
  // 2. Geef de id van exercise item mee aan de dragStart functie via setData
  // 3. Pik die weer op met de dragDrop door die op te vangen in een var via getData

  // is ook nodig want anders wordt de onDrop nooit getriggerd
  function handleDragOver(e) {
    e.preventDefault();
    // console.log("Firing drag OVER");
    // console.log(e);
  }

  // nodig voor de drop functionaliteit en wat er na de drop qua logica gedaan moet worden
  function handleDrop(e, id) {
    e.preventDefault();

    const draggedItemNumber = e.dataTransfer.getData("text/plain");
    const dropItemNumber = id;

    //Logica van array rangschikking

    // copy van de array welke volgens react goed is (arrCopy = exercises) mag niet omdat het een
    // verwijzing naar dezelde array uit state is.
    let arrCopy = [...exercises];

    // verificatie van de id en positie van de dragged item
    const originalItemPosition = arrCopy.findIndex((exercise) => {
      return exercise.id === draggedItemNumber;
    });

    // verificatie van de id en positie van de dropped item
    const newItemPosition = arrCopy.findIndex((exercise) => {
      return exercise.id === dropItemNumber;
    });

    // het verplaatste item
    const draggedItem = arrCopy.splice(originalItemPosition, 1);

    arrCopy.splice(newItemPosition, 0, draggedItem[0]);

    setExercises(arrCopy);
    console.log(exercises);
  }

  return (
    <div className={styles["workout-page"]}>
      {showSnackbar && (
        <Snackbar
          message={snackbarMessage}
          open={showSnackbar}
          status="warning"
          durationVisible={3000}
          onClose={() => setShowSnackbar(false)}
        />
      )}
      <h1>Build Workout</h1>

      {workoutName && <p>Name: {workoutName}</p>}

      <section className={styles["workout-page__header"]}>
        <div>
          <InputWrapper>
            <InputField
              type="text"
              name="exercise"
              id="exercise"
              placeholder="Search exercise"
              handleChange={handleSearchChange}
              value={searchValue}
            />
          </InputWrapper>
          <Button
            buttonType="secondary"
            label="Add"
            type="button"
            buttonSize="small"
            handleClick={() => {
              handleExerciseSearch(EXERCISES);
            }}
          />
        </div>

        <div>
          <InputWrapper>
            <InputField
              type="text"
              name="name"
              id="name"
              placeholder="Workout name"
              handleChange={handleWorkoutNameChange}
              value={workoutNameInput}
            />
          </InputWrapper>
          <Button
            buttonType="primary"
            buttonSize="small"
            type="button"
            label="Save workout"
            handleClick={handleWorkoutSave}
          />
        </div>
      </section>
      <section className={styles["workout-page__exercise-list"]}>
        {exercises && (
          <table className={styles["workout-page__table"]}>
            <thead>
              <tr>
                <th className={styles["table-align-center"]}></th>
                <th className={styles["table-align-left"]}>Exercise</th>
                <th className={styles["table-align-center"]}>Sets</th>
                <th className={styles["table-align-center"]}>Reps</th>
                <th className={styles["table-align-center"]}>Rest</th>
                <th className={styles["table-align-center"]}></th>
              </tr>
            </thead>
            <tbody>
              {/*Onderstaande inline manier is niet de meest performance efficiente blijkbaar*/}
              {exercises.map((exercise) => {
                return (
                  <TableRow
                    key={exercise.id}
                    exercise={exercise}
                    handleDragOver={handleDragOver}
                    onDragStart={(e) => handleDragStart(e, exercise.id)}
                    onDrop={(e) => handleDrop(e, exercise.id)}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
