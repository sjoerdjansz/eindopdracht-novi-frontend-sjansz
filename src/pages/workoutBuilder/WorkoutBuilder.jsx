import styles from "./WorkoutBuilder.module.css";
import axios from "axios";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Button } from "../../components/button/Button.jsx";

import { use, useEffect, useState } from "react";

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
  const [workoutName, setWorkoutName] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState([]);

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

  // function addExerciseToTemplate(addedExercises, templateId) {
  //   console.log(addedExercises);
  //   setWorkoutExercises((prevState) => [
  //     ...prevState,
  //     {
  //       id: addedExercises.id,
  //       workoutTemplateId: templateId,
  //       exerciseId: addedExercises.id,
  //       sets: addedExercises.sets,
  //       reps: addedExercises.reps,
  //       rest: addedExercises.rest,
  //       index: addedExercises.index,
  //     },
  //   ]);
  // }

  async function getAllExercises() {
    try {
      const { data } = await axios.get(API_ENDPOINTS.exercises, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });
      // console.log(data);
      setExercisesFromApi(data);
    } catch (error) {
      console.error(error);
    }
  }

  const getHightestWorkoutId = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.workoutTemplates, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });

      // map workout template id's to new array and sort it from high to low. Get highest num by [0]. Needed when saving the exercise.
      let currentHighest = 0;

      if (data.length > 0) {
        currentHighest = data
          .map((template) => {
            return template.id;
          })
          .sort((a, b) => {
            return b - a;
          })[0];
      }

      return currentHighest + 1;
    } catch (error) {
      console.error(error);
    }
  };

  function handleExerciseParameterChange(e, exerciseId) {
    const { name, value } = e.target;

    setExercises((previousExercise) => {
      return previousExercise.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            [name]: value,
          };
        } else {
          return exercise;
        }
      });
    });
  }

  function handleSearchChange(e) {
    setSearchValue(e.target.value);
  }

  function handleWorkoutNameChange(e) {
    setWorkoutName(e.target.value);
  }

  // functie to add the workout template to the database
  async function postWorkoutTemplate(template) {
    try {
      const response = await axios.post(
        API_ENDPOINTS.workoutTemplates,

        template,

        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  // function to handle the save workout logic: constructing and posting the template and adding the exercises afterwards
  async function handleWorkoutSave() {
    const templateId = await getHightestWorkoutId();

    try {
      const workoutTemplateToSave = {
        id: templateId,
        name: workoutName,
        createdAt: new Date().toISOString(),
        createdByUsersId: "1",
      };

      // push the template to db
      await postWorkoutTemplate(workoutTemplateToSave);

      handleExercisesSave(templateId, exercises);
    } catch (error) {
      console.error(error);
    }
  }

  // 1. bij toevoegen van oefening wordt er een exercise state gemaakt inclusief sets reps rest, per oefening object
  // 2. als ik de save ga doen, map ik over de exercise state en vul ik een saved exercises array met objecten die overeenkomt met database data
  // 3. ik doe de post request net zo vaak als het aantal oefeningen in de array
  // 4. ik handle success en error af. let op: ook nog even een loading animation bij ophalen alle exercises bij onMount
  async function handleExercisesSave(templateId, exercisesData) {
    try {
      for (let i = 0; i < exercisesData.length; i++) {
        const data = {
          workoutTemplateId: templateId,
          exerciseId: exercisesData[i].id,
          sets: exercisesData[i].sets,
          reps: exercisesData[i].reps,
          rest: exercisesData[i].rest,
          index: i,
        };

        const response = await axios.post(
          API_ENDPOINTS.workoutExercises,
          data,
          {
            headers: {
              "novi-education-project-id": import.meta.env.VITE_API_KEY,
              "content-type": "application/json",
            },
          },
        );
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
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
          sets: "",
          reps: "",
          rest: "",
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
    const row = e.currentTarget;
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

    // let op: dataTransfer.getData() wordt altijd een string, daarom de checks in de code ook type matchen
    const draggedItemNumber = e.dataTransfer.getData("text/plain");
    const dropItemNumber = id.toString();

    //Logica van array rangschikking

    if (draggedItemNumber === id) return;

    // copy van de array welke volgens react goed is (arrCopy = exercises) mag niet omdat het een
    // verwijzing naar dezelde array uit state is.
    let arrCopy = [...exercises];

    // verificatie van de id en positie van de dragged item
    const originalItemPosition = arrCopy.findIndex((exercise) => {
      return exercise.id.toString() === draggedItemNumber;
    });

    // verificatie van de id en positie van de dropped item
    const newItemPosition = arrCopy.findIndex((exercise) => {
      return exercise.id.toString() === dropItemNumber;
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
              value={workoutName}
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
              {exercises.length > 0 &&
                exercises.map((exercise) => {
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
