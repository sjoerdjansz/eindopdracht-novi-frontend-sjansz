import styles from "./ExerciseList.module.css";
import { Button } from "../../components/button/Button.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Link, useNavigate } from "react-router-dom";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/api.js";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { BODYPART_FILTER_OPTIONS } from "../../data/clientFilterOptions.js";
import { DeleteConfirmation } from "../../components/deleteConfirmation/DeleteConfirmation.jsx";
import { MOVEMENTS } from "../../data/workoutFilterOptions.js";
import { MUSCLE_GROUPS } from "../../data/muscleGroups.js";

export function ExerciseList() {
  const navigate = useNavigate();
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("");
  const [originalExercises, setOriginalExercises] = useState([]);
  const [findExercises, setFindExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [bodyPartFilter, setBodyPartFilter] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);
  const [exerciseToBeDeleted, setExerciseToBeDeleted] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    getExercises();
  }, []);

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

  // Adds label values to the data object for correct ui view
  function valueToLabel(data, arr, type) {
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

  // Get exercises api call
  async function getExercises() {
    try {
      setIsLoading(true);
      const response = await axios.get(API_ENDPOINTS.exercises, {
        headers: { "novi-education-project-id": import.meta.env.VITE_API_KEY },
      });

      let newData = valueToLabel(response.data, MOVEMENTS, "movement");
      newData = valueToLabel(newData, MUSCLE_GROUPS, "primaryMuscle");

      setOriginalExercises(newData);
      setFindExercises(newData);
    } catch (e) {
      setErrorMessage(
        `${e.response.status}: ${e.code}. Failed to load exercises.`,
      );
      setShowSnackbar(true);
      console.error(e);
    } finally {
      setIsLoading(false);
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
    setExerciseToBeDeleted({ id: id, name: name });
    setDeleteItem(true);
  }

  function handleCancelDelete() {
    setDeleteItem(false);
  }

  async function handleDeleteExercise() {
    try {
      const response = await axios.delete(
        `${API_ENDPOINTS.exercises}/${exerciseToBeDeleted.id}`,
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
          },
        },
      );
      setDeleteItem(false);
      console.log("Exercise successfully deleted");
      await getExercises();
      console.log(response.data);
    } catch (error) {
      console.error(`Error in handle delete exercise catch: ${error}`);
    }
  }

  return (
    <div className={styles["exercise-list"]}>
      <h1>Exercise List</h1>
      {deleteItem && (
        <DeleteConfirmation
          title="Are you sure you want to delete"
          item={exerciseToBeDeleted.name}
          onCancel={handleCancelDelete}
          onDelete={handleDeleteExercise}
        />
      )}

      {showSnackbar && (
        <Snackbar
          message={errorMessage}
          open={showSnackbar}
          status="warning"
          durationVisible={3000}
          onClose={() => {
            setShowSnackbar(false);
          }}
        />
      )}
      <section className={styles["exercise-list__controls"]}>
        <Button
          buttonType="primary"
          type="button"
          buttonSize="medium"
          label="create exercise"
          handleClick={handleCreateExerciseClick}
        />
        {isLoading && <LoadingSpinner />}
        <div className={styles["exercise-list__inputs"]}>
          <InputWrapper>
            <SelectField
              id="bodypart"
              name="bodypart"
              options={BODYPART_FILTER_OPTIONS}
              value={bodyPartFilter}
              title="Bodypart"
              handleChange={filterBodypartChangeHandler}
              onButtonClick={resetAllFilters}
              button={true}
              buttonLabel="reset"
            />
          </InputWrapper>
          <InputWrapper>
            <InputField
              type="text"
              name="find-exercise"
              id="find-exercise"
              placeholder="Find exercise"
              style="primary"
              value={exerciseSearchQuery}
              handleChange={findExerciseChangeHandler}
            />
          </InputWrapper>
        </div>
      </section>
      <table>
        <thead>
          <tr className={styles["exercise-list__header"]}>
            <th className={styles["exercise-name--th"]}>Name</th>
            <th className={styles["exercise-bodypart--th"]}>Bodypart</th>
            <th className={styles["exercise-movement--th"]}>Movement</th>
            <th className={styles["exercise-muscle--th"]}>Primary</th>
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
