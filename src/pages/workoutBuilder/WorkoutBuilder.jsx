import styles from "./WorkoutBuilder.module.css";
import axios from "axios";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Button } from "../../components/button/Button.jsx";

import { useEffect, useState } from "react";

// Components
import { TableRow } from "../../components/tableRow/TableRow.jsx";

// Data
import { EXERCISES } from "../../data/exerciseData.js";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { API_ENDPOINTS } from "../../api/api.js";

export function WorkoutBuilder() {
  const [exercises, setExercises] = useState([]);
  const [exercisesFromApi, setExercisesFromApi] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [workoutTemplate, setWorkoutTemplate] = useState({
    id: "",
    workoutName: "",
    createdAt: "",
    createdBy: "",
  });
  const [workoutExercise, setWorkoutExercise] = useState([]);

  // 1. Onderstaande workoutExercises object moet toegevoegd worden aan de workoutExercises array bij
  // elke nieuw toegevoegde oefening in de workout.
  // 2. Vervolgens functie maken om de workout array te vullen met de exercises, denk aan spread operator
  // 3. Een aparte edit functie maken om de sets, reps en rest per oefening aan te kunnen passen
  // 4. Het hele schema opslaan in de backend door eerst de template op te slaan en daarna de exercises.
  // (5.) nog ff checken of de handleworkout name change niet overkill is

  // id: "",
  // workoutTemplateId: "",
  // exerciseId: "",
  // sets: "",
  // reps: "",
  // rest: "",
  // index: "",

  useEffect(() => {
    getAllExercises();
  }, []);

  async function getAllExercises() {
    try {
      const { data } = await axios.get(API_ENDPOINTS.exercises, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });
      console.log(data);
      setExercisesFromApi(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleExerciseParameterChange(e) {
    const { name, value } = e.target;
    console.log(value);
    console.log(name);
  }
  function handleSearchChange(e) {
    setSearchValue(e.target.value);
  }

  function handleWorkoutNameChange(e) {
    setWorkoutTemplate({
      ...workoutTemplate,
      workoutName: e.target.value,
    });
  }

  function handleWorkoutSave() {
    console.log(workoutTemplate);
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
              handleExerciseSearch(exercisesFromApi);
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
              value={workoutTemplate.name}
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
                    handleChange={handleExerciseParameterChange}
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
