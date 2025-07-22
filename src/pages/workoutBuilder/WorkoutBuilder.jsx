import styles from "./WorkoutBuilder.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

// Components
import { TableRow } from "../../components/tableRow/TableRow.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Button } from "../../components/button/Button.jsx";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";
import { FilteredSearch } from "../../components/filteredSearch/FilteredSearch.jsx";

// Api
import { API_ENDPOINTS } from "../../api/api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export function WorkoutBuilder() {
  // exercises state main purpose is UI, drag and drop and adding parameters
  const [exercises, setExercises] = useState([]);
  // exercisesFromApi state is for http request to get all the exercises in state
  const [allSearchableExercises, setAllSearchableExercises] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [workoutName, setWorkoutName] = useState("");

  // utility states
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    status: "",
  });
  const [showSearchFilter, setShowSearchFilter] = useState(false);

  useEffect(() => {
    fetchAllExercises();
  }, []);

  useEffect(() => {
    setShowSearchFilter(true);
  }, [searchValue]);

  // get all exercises from api and into state
  async function fetchAllExercises() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.exercises, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });
      setAllSearchableExercises(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // ----- SAVE NEW WORKOUT (TEMPLATE AND WORKOUT EXERCISES) ----- //
  async function saveNewWorkout(templateName, exercisesArr) {
    const workoutTemplateObject = {
      name: templateName ? templateName : "Workout",
      createdAt: new Date().toISOString(),
      createdByUsersId: 1, // change to userId from userContext (which is the logged in trainer)
    };

    try {
      setIsLoading(true);
      if (exercises.length > 0) {
        const response = await axios.post(
          `${API_ENDPOINTS.workoutTemplates}`,
          workoutTemplateObject,
          {
            headers: {
              "novi-education-project-id": import.meta.env.VITE_API_KEY,
              "Content-Type": "application/json",
            },
          },
        );

        for (let i = 0; i < exercisesArr.length; i++) {
          const exerciseDataObject = {
            workoutTemplateId: response.data.id,
            exerciseId: exercisesArr[i].exerciseId,
            sets: parseInt(exercisesArr[i].sets) || 3,
            reps: parseInt(exercisesArr[i].reps) || 12,
            rest: parseInt(exercisesArr[i].rest) || 90,
            index: i,
          };
          await axios.post(
            `${API_ENDPOINTS.workoutExercises}`,
            exerciseDataObject,
            {
              headers: {
                "novi-education-project-id": import.meta.env.VITE_API_KEY,
                "Content-Type": "application/json",
              },
            },
          );
        }

        setShowSnackbar({
          open: true,
          message: `Workout ${workoutTemplateObject.name} has been added`,
          status: "success",
        });
      } else {
        setShowSnackbar({
          open: true,
          message: "Add at least one exercise",
          status: "error",
        });
      }
    } catch (error) {
      console.log(error);
      setShowSnackbar({
        open: true,
        message: "Add at least one exercise and a valid workout name",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // function to handle the changes to the (sets, reps, rest) parameters per exercise
  function handleExerciseParameterChange(e, exerciseId) {
    const { name, value } = e.target;

    // takes an anonymous function with previousExercises as a param, which are exercises already in the state
    setExercises((previousExercises) => {
      return previousExercises.map((exercise) => {
        // check if ids are the same
        // return new object with updated sets reps and rest
        if (exercise.exerciseId === exerciseId) {
          return {
            ...exercise, // spread existing obj properties
            [name]: value, // dynamic update of changed property
          };
        } else {
          // else return exercise unchanged
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

  function handleDeleteExercise(id) {
    if (!id) {
      return;
    }
    console.log("deleted:", id);

    // update state/ui
    // temporary array copy that keeps all the exercises that don't have matching ids
    const updatedExerciseArray = exercises.filter((exercise) => {
      return exercise.exerciseId !== id;
    });

    setExercises(updatedExerciseArray);
  }

  // ----- SELECTING EXERCISE FROM FILTER ----- //
  // function that handles the selection of an exercise from the search exercise filtering dropdown
  function handleFilterSelectExercise(exercise) {
    // check if the exercise is already in the workout
    const duplicate = exercises.some((e) => {
      return e.exerciseId === exercise.id;
    });

    if (duplicate) {
      setShowSnackbar({
        open: true,
        message: "Exercise is already in workout",
        status: "error",
      });
      return;
    }
    // add selected exercise to exercises state
    // While keeping all the previous items in the array (functional state update, de nieuwe baseren op de vorige)
    // Only set the id and name so the parameters can be filled in later.
    setExercises((previous) => [
      ...previous,
      {
        exerciseId: exercise.id,
        name: exercise.name,
        sets: "",
        reps: "",
        rest: "",
      },
    ]);
    setShowSnackbar({
      open: false,
      message: "",
      status: "",
    });
    setSearchValue("");
  }

  // ----- EXERCISE SEARCH ----- //
  function handleExerciseSearch(data) {
    // cleanup the searchQuery (might need moving to where it's been set in state)
    const searchQuery = searchValue.toLowerCase().trim();
    setShowSnackbar({
      open: false,
      message: "",
      status: "",
    });

    // data is just the exercises
    // check for exercise in data
    const result = data.find((exercise) => {
      return exercise.name.toLowerCase() === searchQuery;
    });

    // check if exercise is already in the workout
    if (result) {
      if (exercises.some((exercise) => exercise.exerciseId === result.id)) {
        setShowSnackbar({
          open: true,
          message: "Exercise is already in workout",
          status: "error",
        });

        return; // Stop early and don't add
      }

      // Add exercise if it's no duplicate, while making sure the previous state/exercises stay the same by spreading
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
      setShowSnackbar({
        open: true,
        message: "Exercise not found",
        status: "warning",
      });
      setSearchValue("");
    }
  }

  // ----- DRAG AND DROP LOGIC ----- //
  // de start van de drag - item wordt opgepakt
  function handleDragStart(e, id) {
    e.dataTransfer.setData("text/plain", id);
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
      return exercise.exerciseId.toString() === draggedItemNumber;
    });

    // verificatie van de id en positie van de dropped item
    const newItemPosition = arrCopy.findIndex((exercise) => {
      return exercise.exerciseId.toString() === dropItemNumber;
    });

    // het verplaatste item
    const draggedItem = arrCopy.splice(originalItemPosition, 1);

    arrCopy.splice(newItemPosition, 0, draggedItem[0]);

    setExercises(arrCopy);
    console.log(exercises);
  }

  return (
    <div className={styles["workout-page"]}>
      {isLoading && <LoadingSpinner />}

      {showSnackbar && (
        <Snackbar
          message={showSnackbar.message}
          open={showSnackbar.open}
          status={showSnackbar.status}
          durationVisible={3000}
          onClose={() =>
            setShowSnackbar({
              ...showSnackbar,
              open: false,
            })
          }
        />
      )}
      <h1>Build Workout</h1>

      <section className={styles["workout-page__header"]}>
        <div className={styles["exercise-search-container"]}>
          <InputWrapper width="small">
            <InputField
              type="text"
              name="exercise"
              id="exercise"
              placeholder="Find exercise"
              handleChange={handleSearchChange}
              value={searchValue}
              icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              onFocus={() => setShowSearchFilter(true)}
            />
            <Button
              buttonType="secondary"
              label="Add"
              type="button"
              buttonSize="small"
              handleClick={() => {
                handleExerciseSearch(allSearchableExercises);
              }}
            />
          </InputWrapper>
          {showSearchFilter && (
            <FilteredSearch
              exercises={allSearchableExercises}
              searchValue={searchValue}
              handleSelectExercise={(exercise) => {
                handleFilterSelectExercise(exercise);
                setShowSearchFilter(false);
              }}
              onClose={() => setShowSearchFilter(false)}
            />
          )}
        </div>

        <div className={styles["workout-name-container"]}>
          <InputWrapper width="small">
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
            handleClick={() => {
              saveNewWorkout(workoutName, exercises);
            }}
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
              {/*I read that this 'inline' way is not the most efficient one to use*/}
              {exercises.length > 0 &&
                exercises.map((exercise) => {
                  return (
                    <TableRow
                      key={exercise.exerciseId}
                      exercise={exercise}
                      handleDragOver={handleDragOver}
                      onDragStart={(e) =>
                        handleDragStart(e, exercise.exerciseId)
                      }
                      onDrop={(e) => handleDrop(e, exercise.exerciseId)}
                      handleChange={handleExerciseParameterChange}
                      handleDelete={() =>
                        handleDeleteExercise(exercise.exerciseId)
                      }
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
