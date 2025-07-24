import styles from "./ExerciseList.module.css";
import { Button } from "../../components/button/Button.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Link, useNavigate } from "react-router-dom";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../api/api.js";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { BODYPART_FILTER_OPTIONS } from "../../data/clientFilterOptions.js";
import { DeleteConfirmation } from "../../components/deleteConfirmation/DeleteConfirmation.jsx";
import { MOVEMENTS } from "../../data/workoutFilterOptions.js";
import { MUSCLE_GROUPS } from "../../data/muscleGroups.js";
import { useApiRequest } from "../../hooks/useApiRequest.jsx";

export function ExerciseList() {
  const navigate = useNavigate();
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("");
  const [originalExercises, setOriginalExercises] = useState([]);
  const [findExercises, setFindExercises] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    status: "",
  });
  const [bodyPartFilter, setBodyPartFilter] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);
  const [exerciseToBeDeleted, setExerciseToBeDeleted] = useState({
    id: "",
    name: "",
  });

  const {
    data: exercisesData,
    error: getError,
    isLoading: loadingExercises,
    doRequest: getExercises,
  } = useApiRequest();

  const { doRequest: deleteExercise } = useApiRequest();

  useEffect(() => {
    async function fetchExercises() {
      const result = await getExercises({
        method: "GET",
        url: API_ENDPOINTS.exercises,
      });

      if (result) {
        const cleaned = cleanExerciseData(result);
        setOriginalExercises(cleaned);
        setFindExercises(cleaned);
      }
    }
    void fetchExercises();
  }, []);

  useEffect(() => {
    if (getError) {
      setShowSnackbar({
        message: "Failed to load exercises.",
        open: true,
        status: "error",
      });
    }
  }, [exercisesData, getError, loadingExercises]);

  useEffect(() => {
    let filteredExercises = originalExercises;

    if (exerciseSearchQuery) {
      filteredExercises = filteredExercises.filter((exercise) => {
        return exercise.name.toLowerCase().includes(exerciseSearchQuery);
      });
    }

    if (bodyPartFilter) {
      filteredExercises = filteredExercises.filter((exercise) => {
        return (
          exercise.bodypart.toLowerCase().replaceAll(" ", "") ===
          bodyPartFilter.toLowerCase().trim()
        );
      });
    }

    setFindExercises(filteredExercises);
  }, [bodyPartFilter, exerciseSearchQuery, originalExercises]);

  function cleanExerciseData(exercisesDataToClean) {
    if (exercisesDataToClean) {
      let cleanedExercises = valueToLabel(
        exercisesDataToClean,
        MOVEMENTS,
        "movement",
      );
      cleanedExercises = valueToLabel(
        cleanedExercises,
        MUSCLE_GROUPS,
        "primaryMuscle",
      );

      const sortedExercises = cleanedExercises.sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      return sortedExercises;
    }
  }

  // Adds label values to the data object for correct ui view
  function valueToLabel(data, arr, type) {
    if (!data) {
      return;
    }
    return data.map((item) => {
      const matched = arr.find((val) => {
        return val.value === item[type];
      });
      return {
        ...item,
        [`${type}Label`]: matched ? matched.label : "",
      };
    });
  }

  async function handleDeleteExercise() {
    try {
      await deleteExercise({
        method: "DELETE",
        url: `${API_ENDPOINTS.exercises}/${exerciseToBeDeleted.id}`,
      });

      setShowSnackbar({
        open: true,
        status: "success",
        message: `${exerciseToBeDeleted.name} has been deleted`,
      });
      setDeleteItem(false);
      const refreshedExercises = await getExercises({
        method: "GET",
        url: API_ENDPOINTS.exercises,
      });

      if (refreshedExercises) {
        const cleaned = cleanExerciseData(refreshedExercises);
        setOriginalExercises(cleaned);
        setFindExercises(cleaned);
      }
    } catch (error) {
      console.error(`Error in handle delete exercise catch: ${error}`);
    }
  }

  const handleCreateExerciseClick = () => {
    navigate("/exercise-library/create");
  };

  function findExerciseChangeHandler(e) {
    setExerciseSearchQuery(e.target.value.toLowerCase());
  }

  function filterBodypartChangeHandler(e) {
    setBodyPartFilter(e.target.value.toLowerCase().trim().replaceAll(" ", ""));
  }

  function resetAllFilters() {
    setBodyPartFilter("");
    setExerciseSearchQuery("");
  }

  function deleteExerciseButtonClick(e, id, name) {
    setExerciseToBeDeleted({
      id: id,
      name: name,
    });
    setDeleteItem(true);
  }

  function handleCancelDelete() {
    setDeleteItem(false);
  }

  return (
    <div className={styles["exercise-list"]}>
      {showSnackbar.open && (
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
      <section className={styles["exercise-list__controls"]}>
        <div>
          <h1>Exercise List</h1>
          <Button
            buttonType="primary"
            type="button"
            buttonSize="medium"
            label="create exercise"
            handleClick={handleCreateExerciseClick}
          />
        </div>
        <div className={styles["exercise-list__inputs"]}>
          <InputWrapper width="small">
            <SelectField
              id="bodypart"
              name="bodypart"
              options={BODYPART_FILTER_OPTIONS}
              value={bodyPartFilter}
              title="Body part"
              handleChange={filterBodypartChangeHandler}
              onButtonClick={resetAllFilters}
              button={true}
              buttonLabel="reset"
              buttonStyle="secondary"
            />
          </InputWrapper>
          <InputWrapper width="small">
            <InputField
              type="text"
              name="find-exercise"
              id="find-exercise"
              placeholder="Find exercise"
              style="primary"
              value={exerciseSearchQuery}
              handleChange={findExerciseChangeHandler}
              icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            />
          </InputWrapper>
        </div>
      </section>
      {loadingExercises && <LoadingSpinner />}

      {deleteItem && (
        <DeleteConfirmation
          title="Are you sure you want to delete"
          item={exerciseToBeDeleted.name}
          onCancel={handleCancelDelete}
          onDelete={handleDeleteExercise}
        />
      )}
      <table>
        <thead>
          <tr className={styles["exercise-list__header"]}>
            <th className={styles["exercise-name--th"]}>Name</th>
            <th className={styles["exercise-bodypart--th"]}>Body part</th>
            <th className={styles["exercise-movement--th"]}>Movement</th>
            <th className={styles["exercise-muscle--th"]}>Primary Muscle</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {originalExercises &&
            findExercises.map((exercise) => {
              return (
                <tr key={exercise.id} className={styles["exercise-list__row"]}>
                  <td className={styles["exercise-name--td"]}>
                    {exercise.name}
                  </td>
                  <td className={styles["exercise-bodypart--td"]}>
                    {exercise.bodypart}
                  </td>
                  <td className={styles["exercise-movement--td"]}>
                    {exercise.movementLabel}
                  </td>
                  <td className={styles["exercise-muscle--td"]}>
                    {exercise.primaryMuscleLabel}
                  </td>
                  <td className={styles["exercise-list__icons"]}>
                    <span>
                      <Link to={`/exercise-library/create/${exercise.id}`}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Link>
                      <Link to={""}>
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={(e) =>
                            deleteExerciseButtonClick(
                              e,
                              exercise.id,
                              exercise.name,
                            )
                          }
                        />
                      </Link>
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
