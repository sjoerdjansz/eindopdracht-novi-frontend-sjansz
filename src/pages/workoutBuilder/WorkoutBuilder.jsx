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
  // exercisesFromApi state is for http request to get all the exercises
  const [exercisesFromApi, setExercisesFromApi] = useState([]);
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
    getAllExercises();
  }, []);

  useEffect(() => {
    setShowSearchFilter(true);
  }, [searchValue]);

  // get all exercises from api and into state
  async function getAllExercises() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.exercises, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });
      setExercisesFromApi(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // function to get the current highest workout id from the workoutTemplates
  const getHightestWorkoutId = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.workoutTemplates, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });

      // map workout template id's to new array and sort it from high to low. Get highest num by [0].
      // Needed when saving the exercise
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
      // add 1 to increment to the correct count
      return currentHighest + 1;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // function to handle the changes to the (sets, reps, rest) parameters per exercise
  function handleExerciseParameterChange(e, exerciseId) {
    const { name, value } = e.target;

    // takes an anonymous function with previousExercises as a param, which are exercises already in the state
    setExercises((previousExercises) => {
      return previousExercises.map((exercise) => {
        // check if ids are the same
        // return new object with updated sets reps and rest
        if (exercise.id === exerciseId) {
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
    // temporary array copy that keeps all the exercises that don't have matching ids
    const updatedExerciseArray = exercises.filter((exercise) => {
      return exercise.id !== id;
    });

    setExercises(updatedExerciseArray);
  }

  // functie to add the workout template to database
  async function postWorkoutTemplate(template) {
    try {
      const response = await axios.post(
        API_ENDPOINTS.workoutTemplates,

        template, // workout template object as data

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

  // TODO: make sure there is error handling when user adds 1 char name at workout builder when saving. bugged

  // function to handle the save workout logic: constructing and posting the template and adding the exercises afterwards
  async function handleWorkoutSave() {
    // check if there are workouts added and if there's a name, if not: return
    if (!workoutName || exercises.length === 0) {
      setShowSnackbar({
        open: true,
        message: "Make sure the workout has a name and at least one exercise",
        status: "error",
      });
      return;
    }

    const templateId = await getHightestWorkoutId();

    try {
      const workoutTemplateToSave = {
        id: templateId,
        name: workoutName,
        createdAt: new Date().toISOString(),
        createdByUsersId: "1", // TODO: add user through useContext() hook
      };

      // push the template & exercises to db
      await postWorkoutTemplate(workoutTemplateToSave);
      await handleExercisesSave(templateId, exercises);

      setShowSnackbar({
        open: true,
        message: "Workout template saved successfully",
        status: "success",
      });
    } catch (error) {
      console.error(error);
      setShowSnackbar({
        open: true,
        message: "Error while saving workout",
        status: "warning",
      });
    }
  }
  // function that adds the exercises to the database
  // TODO: low prio - change to Promise.all
  async function handleExercisesSave(templateId, exercisesData) {
    // reset snackbar
    try {
      setShowSnackbar({
        open: false,
        message: "",
        status: "",
      });

      // loop over all exercises that are currently in de exercisesData array
      for (let i = 0; i < exercisesData.length; i++) {
        // create a scoped data object to add to post request with each iteration
        const data = {
          workoutTemplateId: templateId, // parent workout template id
          exerciseId: exercisesData[i].id, // exercise id (matches exercises from api)
          sets: exercisesData[i].sets || 3, // paramaters with default if no value is given
          reps: exercisesData[i].reps || 12,
          rest: exercisesData[i].rest || 90,
          index: i, // use index of loop to set the exercise order (for when we have to get the workout later)
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
      setShowSnackbar({
        open: true,
        message: "Error while saving an exercise",
        status: "warning",
      });
    }
  }

  // function that handles the selection of an exercise from the search exercise filtering dropdown
  function handleFilterSelectExercise(exercise) {
    // check if the exercise is already in the workout
    const duplicate = exercises.some((e) => {
      return e.id === exercise.id;
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
      { id: exercise.id, name: exercise.name, sets: "", reps: "", rest: "" },
    ]);
    setShowSnackbar({
      open: false,
      message: "",
      status: "",
    });
    setSearchValue("");
  }

  // regular exercise search
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
      if (exercises.some((exercise) => exercise.id === result.id)) {
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
                handleExerciseSearch(exercisesFromApi);
              }}
            />
          </InputWrapper>
          {showSearchFilter && (
            <FilteredSearch
              exercises={exercisesFromApi}
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
                      handleDelete={() => handleDeleteExercise(exercise.id)}
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
